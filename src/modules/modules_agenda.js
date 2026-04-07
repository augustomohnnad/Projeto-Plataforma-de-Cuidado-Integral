const {openDb} = require("../database/config/configDatabase")
const modelAgenda = require("../database/models/model_agenda")
const controllerAgenda = require("../controllers/controllerAgenda")

const routerAgenda = require("../router/rotas_agenda")

const moduleAgenda = async (app) => {
    const db = await openDb()
    const agendaModel = new modelAgenda(db)
    await agendaModel.tabelaAgenda()

    const controller = new controllerAgenda (agendaModel)
    app.use("/api/agendamento", routerAgenda(controller))
}

module.exports = moduleAgenda
