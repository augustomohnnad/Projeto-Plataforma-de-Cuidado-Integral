class modelPaciente {
    constructor(db) {
        this.db = db
    }

    tabelaPacientes = async () => {
        const sql = (`
        CREATE TABLE IF NOT EXISTS tb_pacientes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_paciente TEXT,
            cpf TEXT UNIQUE,
            endereco TEXT,
            cep INT,
            contato_responsavel TEXT,
            observacao TEXT,
            status_paciente TEXT DEFAULT 'ATIVO'
            )
        `)

        await this.db.exec(sql)
    }
    
    insertPaciente = async (nome_paciente, cpf, endereco, cep, contato_responsavel, observacao) => {
        const sql = (`
            INSERT INTO tb_pacientes(
            nome_paciente, 
            cpf, 
            endereco, 
            cep, 
            contato_responsavel, 
            observacao) VALUES (?, ?, ?, ?, ?, ?)               
        `)

        return await this.db.run(sql, [nome_paciente, cpf, endereco, cep, contato_responsavel, observacao])
    }
    
    selectPacientes = async () => {
        return await this.db.all(`SELECT *FROM tb_pacientes`)
    }

    selectIdPaciente = async (id) => {
        return await this.db.all(`SELECT *FROM tb_pacientes
            WHERE id = ?`, [id]
        )
    }

    updatePaciente = async (nome_paciente, cpf, endereco, cep, contato_responsavel, observacao, id) => {
        const sql = (`
            UPDATE tb_pacientes
            SET nome_paciente = ?, 
            cpf = ?, 
            endereco = ?, 
            cep = ?, 
            contato_responsavel = ?, 
            observacao = ? 
            WHERE id = ?
        `)
        return await this.db.run(sql, [nome_paciente, cpf, endereco, cep, contato_responsavel, observacao, id])
    }

    deletePaciente = async (id) => {
        return await this.db.run(`
            DELETE FROM tb_pacientes
            WHERE id = ?
            `, [id]
        )
    }
}

module.exports = modelPaciente