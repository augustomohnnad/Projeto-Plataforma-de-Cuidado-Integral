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

            FOREIGN KEY (paciente_vinculado) REFERENCES tb_pacientes(id)
        )

            
        `)

        await this.db.exec(sql, "PRAGMA foreign_keys = ON")
        
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
                tb_agenda.descricao_atendimento,
                tb_agenda.dia_atendimento,
                tb_agenda.hora_atendimento
            FROM
                tb_agenda
            JOIN tb_pacientes 
            ON tb_agenda.paciente_vinculado = tb_pacientes.id
        `)
        return await this.db.all(sql)

    }


}

module.exports = modelAgenda