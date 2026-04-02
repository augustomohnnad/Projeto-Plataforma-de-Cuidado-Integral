const {openDb} = require("../database/config/configDatabase")
const modelPaciente = require("../database/models/model_pacientes")
const controllerPacientes = require("../controllers/controllerPacientes")
const routerPacientes = require("../router/rotas_pacientes")

const modulesPaciente = async (app) => {
    const db = await openDb()
    const model = new modelPaciente(db)
    await model.tabelaPacientes()

    const controller = new controllerPacientes(model)
    app.use("/api/pacientes", routerPacientes(controller))
}

module.exports = modulesPaciente