class modelAgenda {
    constructor(db) {
        this.db = db
    }

    tabelaAgenda = async () => {
        const sql = (`
            CREATE TABLE IF NOT EXISTS tb_agenda(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_vinculado INTEGER,
            descricao_atendimento TEXT,
            dia_atendimento TEXT,
            hora_atendimento TEXT,
            resultado_atendimento TEXT,
            status_agendamento TEXT DEFAULT 'AGENDADO',

            FOREIGN KEY (paciente_vinculado) REFERENCES tb_pacientes(id)
        )

            
        `)

        return await this.db.exec(sql)
        
    }

    insertAgenda = async (paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento) => {
        const sql = (`
            INSERT INTO tb_agenda(
            paciente_vinculado, 
            descricao_atendimento, 
            dia_atendimento, 
            hora_atendimento) VALUES (?, ?, ?, ?)
        `)

        return await this.db.run(sql, [paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento])
    }

    selectAgendamento = async () => {
        const sql = (`
            SELECT
                tb_agenda.id, 
                tb_pacientes.nome_paciente,
                tb_pacientes.observacao,
                tb_agenda.descricao_atendimento,
                tb_agenda.dia_atendimento,
                tb_agenda.hora_atendimento,
                tb_agenda.resultado_atendimento,
                tb_agenda.status_agendamento
            FROM
                tb_agenda
            JOIN tb_pacientes 
            ON tb_agenda.paciente_vinculado = tb_pacientes.id
        `)
        return await this.db.all(sql)

    }

    selectAgendamentoPorPaciente = async (paciente_vinculado) => {
        const sql = (`
            SELECT
                tb_agenda.id,
                tb_pacientes.nome_paciente,
                tb_pacientes.observacao,
                tb_agenda.descricao_atendimento,
                tb_agenda.dia_atendimento,
                tb_agenda.hora_atendimento,
                tb_agenda.resultado_atendimento,
                tb_agenda.status_agendamento
            FROM
                tb_agenda
            JOIN tb_pacientes
            ON tb_agenda.paciente_vinculado = tb_pacientes.id
            WHERE tb_agenda.paciente_vinculado = ?    
        `)

        return await this.db.all(sql, [paciente_vinculado])
    }

    updateAgenda = async (paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento, resultado_atendimento, status_agendamento, id) => {
        const sql = (`
            UPDATE tb_agenda
            SET paciente_vinculado = ?, 
            descricao_atendimento = ?, 
            dia_atendimento = ?, 
            hora_atendimento = ?,
            resultado_atendimento = ?, 
            status_agendamento = ?
            WHERE id = ?
        `)
        return await this.db.run(sql, [paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento, resultado_atendimento, status_agendamento, id])
    }



    deleteAgendamento = async (id) => {
        const sql = (`
            DELETE FROM tb_agenda 
            WHERE id = ?
        `)
        
        return await this.db.run(sql, [id])
    }


}

module.exports = modelAgenda