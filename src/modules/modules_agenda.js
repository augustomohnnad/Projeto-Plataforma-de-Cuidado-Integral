const {openDb} = require("../database/config/configDatabase")
const modelAgenda = require("../database/models/model_agenda")
const controllerAgenda = require("../controllers/controllerAgenda")
const routerAgenda = require("../router/rotas_agenda")

const moduleAgenda = async (app) => {
    const db = await openDb()
    const model = new modelAgenda(db)
    await model.tabelaAgenda()

    const controller = new controllerAgenda (model)
    app.use("/api/agendamento", routerAgenda(controller))
}

module.exports = moduleAgenda
