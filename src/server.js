const express = require("express");
const cors = require('cors')
const modulesPaciente = require("./modules/module_pacientes");
const modulesAgenda = require("./modules/modules_agenda");

const app = express();
app.use(cors())
app.use(express.json());

async function start() {
    await modulesPaciente(app)
    await modulesAgenda(app)

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando: http://127.0.0.1:${PORT}`)
    })
}

start()