class Agenda {
    constructor(modelAgenda) {
        this.modelAgenda = modelAgenda;
    }

    lançarAgendamento = async (req, res) => {
        try {
            const {paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento} = req.body

            if(!paciente_vinculado) {
                throw new Error("Paciente Precisa ser informado");
                
            }

            await this.modelAgenda.insertAgenda(paciente_vinculado, descricao_atendimento, dia_atendimento, hora_atendimento)

            return res.status(201).json(`Paciente ${paciente_vinculado}, agendado com sucesso`)
        
        } catch (e) {
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
            console.error(`[ERRO NO SERVIDOR] ${e.message}`)
            return res.status(500).json({
                error: true,
                mensagem: e.message
            })

        }
        
        
    }
}

module.exports = Agenda