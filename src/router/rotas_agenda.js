const express = require("express");

module.exports = (controller) => {
    const router = express.Router()

    router.post("/", (req, res) => (controller.lançarAgendamento(req, res)))
    router.get("/", (req,res) => (controller.listaAgendamento(req, res)))


    return router
}

