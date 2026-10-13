const express = require("express");
const integration = express.Router();
const integrationAuth = require("../middlewares/integration-auth");
const IntegrationController = require("../controllers/integration");

// API servidor-a-servidor para FCSUNSM. No usa sesiones ni JWT de usuarios.
integration.get(
    "/v1/students/:documentNumber/academic-status",
    integrationAuth,
    IntegrationController.getStudentAcademicStatus
);

module.exports = integration;
