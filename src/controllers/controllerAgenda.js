class Agenda {
    constructor(modelAgenda) {
        this.modelAgenda = modelAgenda;
    }

    lançarAgendamento = async (req, res) => {
        try {
            const {paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento} = req.body
            
            await this.modelAgenda.insertAgenda(paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento)
            return res.status(201).json(`Paciente ${paciente_vinculado}, agendado com sucesso`)
        
        } catch (e) {
            if(e.message.includes("FOREIGN KEY")) {
                console.error(`[ATENÇÃO]: ${e.message}`)
                return res.status(400).json({
                    error: true,
                    menssagem: "Erro: O paciente informado não está cadastrado no sistema."
                })
            }
            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                error: true,
                mensagem: e.message
            })
        } 
        
    }

    listaAgendamento = async (req, res) => {
        try {
            const listaAgendamento = await this.modelAgenda.selectAgendamento()
            if(!listaAgendamento) {
                throw new Error("Nenhum agendamento encontrado")
            }

            return res.status(200).json(listaAgendamento)
        
        }catch (e) {
            console.error(`[ERRO AO PESQUISAR] ${e.message}`)
            return res.status(404).json({
                error: true,
                mensagem: e.message
            })

        }
        
        
    }

    getAgendamentoPorPaciente = async (req, res) => {
        try {
            const { paciente_vinculado } = req.params
            const buscarPaciente = await this.modelAgenda.selectAgendamentoPorPaciente(Number(paciente_vinculado))

            if(!buscarPaciente || buscarPaciente.length === 0) {
                throw new Error("Não existe agendamento para o paciente informado")
            }

            return res.status(200).json(buscarPaciente)

        } catch (e) {
            console.error(`[ERRO AO PESQUISAR] ${e.message}`)
            return res.status(404).json({
                error: true,
                mensagem: e.message
            })
        }   
        
    }

    editarAgendamento = async (req, res) => {
        try {
            const { id } = req.params
            const {paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento, resultado_atendimento, status_agendamento} = req.body

            await this.modelAgenda.updateAgenda(paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento, resultado_atendimento, status_agendamento, id)

            return res.status(200).json(`dados Paciente ${id}, atualizado com sucesso!`)

        } catch (e) {
            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
            
        }
       
        
    }


    apagarAgendamento = async (req, res) => {
        try {
            const { id } = req.params

            const result = await this.modelAgenda.deleteAgendamento(Number(id))
            if (result.changes === 0) {
                return res.status(404).json({
                    error: true,
                    mensagem: "Agendamento não encontrado"
                })
            }

            return res.status(200).json({
                error: false,
                mensagem: "Agendamento deletado com sucesso"
            })

        } catch (e) {
            console.error(e)
            return res.status(500).json({
                error: true,
                mensagem: e.message
            })
        }
    }

}

module.exports = Agenda