const express = require("express");
const modulerPaciente = require("./modules/module_pacientes");
const moduleAgenda = require("./modules/modules_agenda");

const app = express();
app.use(express.json());

async function start() {
    await modulerPaciente(app)
    await moduleAgenda(app)

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando: http://127.0.0.1:${PORT}`)
    })
}

start()