const express = require("express")

module.exports = (controller) => {
    const router = express.Router()

    router.post("/", (req, res) =>controller.cadastroPaciente(req, res))
    router.get("/", (req, res) => controller.listarPacientes(req, res))
    router.get("/:id", (req, res) => controller.getIdPaciente(req, res))
    router.put("/:id", (req, res) => controller.editarPaciente(req, res))
    router.delete("/:id", (req, res) => controller.deletPaciente(req, res))

    return router
}