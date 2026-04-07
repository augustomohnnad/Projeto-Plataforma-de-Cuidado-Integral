const {openDb} = require("../database/config/configDatabase")
const modelPaciente = require("../database/models/model_pacientes")
const controllerPacientes = require("../controllers/controllerPacientes")
const routerPacientes = require("../router/rotas_pacientes")

const modulesPaciente = async (app) => {
    const db = await openDb()
    const pacienteModel = new modelPaciente(db)
    await pacienteModel.tabelaPacientes()

    const controller = new controllerPacientes(pacienteModel)
    app.use("/api/pacientes", routerPacientes(controller))
}

module.exports = modulesPaciente