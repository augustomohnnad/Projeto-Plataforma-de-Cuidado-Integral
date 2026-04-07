const express = require("express");

module.exports = (controller) => {
    const router = express.Router()

    router.post("/", (req, res) => (controller.lançarAgendamento(req, res)))
    router.get("/", (req,res) => (controller.listaAgendamento(req, res)))
    router.get("/:paciente_vinculado", (req,res) => (controller.getAgendamentoPorPaciente(req, res)))
    router.put("/:id", (req, res) => (controller.editarAgendamento(req, res)))
    router.delete("/:id", (req, res) => (controller.apagarAgendamento(req,res)))

    return router
}

