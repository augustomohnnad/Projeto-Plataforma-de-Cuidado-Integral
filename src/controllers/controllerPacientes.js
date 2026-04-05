class Paciente {
    constructor(pacienteModel) {
        this.pacienteModel = pacienteModel
    }

    cadastroPaciente = async (req, res) => {
        try {
             const {nome_paciente, cpf, endereco, cep, contato_responsavel, observacao} = req.body

            if(!req.body.cpf || req.body.cpf.length !== 11) {
                throw  new Error(`${nome_paciente} com CPF vazio ou menor que 11 digitos.`);

            } else {
                await this.pacienteModel.insertPaciente(nome_paciente, cpf, endereco, cep, contato_responsavel, observacao)

                res.status(201).send(`${nome_paciente}, cadastrado com sucesso`)
            }

        } catch (e) {
            if(e.message.includes("CPF")) {
                console.error(`[ERRO NO CADASTRO]: ${e.message}`)
                return res.status(400).json({
                    erro: true, 
                    mensagem: e.message
                })
            } 

            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
            
        }
        
    };

    listarPacientes = async (req, res) => {
        try {
            const listaPacientes = await this.pacienteModel.selectPacientes()
            if(!(listaPacientes)) {
                throw new Error(`Lista de pacientes vazia!!!`)
               
            }

            return res.status(200).json(listaPacientes)

        } catch (e) {
            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
        }
        
        
    }

    getIdPaciente = async (req, res) => {
        try  {
            const { id } = req.params
            const idPaciente = await this.pacienteModel.selectIdPaciente(Number(id))

            if(!idPaciente || idPaciente.length === 0) {
                throw new Error(`Paciente não encontrado ou "ID" invalido`)
            }

            return res.status(200).json(idPaciente)
        
        } catch (e) {
            if(e.message.includes("ID")){
                console.error(`[ERRO AO BUSCAR ID]: ${e.message}`)
                return res.status(404).json({
                    Error: true, 
                    menssagem: e.message
                })
            
            } 
            
            console.error(`[ERRO INTERNO]: ${e.messagem}`)
            return res.status(500).json({
                erro: true, 
                menssagem: e.message
            })
        }

        
        
    } 

    editarPaciente = async (req, res) => {
        try {
            const { id } = req.params
            const {nome_paciente, cpf, endereco, cep, contato_responsavel, observacao} = req.body

            if(!req.body.cpf || req.body.cpf.length !== 11) {
                throw  new Error(`${nome_paciente} com CPF vazio ou menor que 11 digitos.`);
            }

            await this.pacienteModel.updatePaciente(nome_paciente, cpf, endereco, cep, contato_responsavel, observacao, id)

            return res.status(200).json(`dados Paciente ${nome_paciente}, atualizado com sucesso!`)

        } catch (e) {
            if(e.message.includes("CPF")) {
                console.error(`[ERRO NA EDIÇÃO DO PACIENTE]: ${e.message}`)
                return res.status(400).json({
                    erro: true, 
                    mensagem: e.message
                })
            } 

            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
            
        }
       
        
    } 
    
    deletPaciente = async (req, res) => {
        try {
            const { id } = req.params
            const pacienteExiste = await this.pacienteModel.selectIdPaciente(Number(id))
            if(!pacienteExiste || pacienteExiste.length === 0) {
                throw new Error(`Paciente não encontrado para Deletar`)
            }
            await this.pacienteModel.deletePaciente(Number(id))
            return res.status(200).json(`Paciente deletado com sucesso`)
        
        } catch (e) {
            if(e.message.includes("ID")){
                console.error(`[ERRO AO BUSCAR ID PARA DELETAR]: ${e.message}`)
                return res.status(404).json({
                    Error: true, 
                    menssagem: e.message
                })
            
            } 
            
            console.error(`[ERRO INTERNO]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                menssagem: e.message
            })
        } 
        

    }

}

module.exports = Paciente