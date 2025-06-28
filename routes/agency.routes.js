const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agency.controller");

// Endpoints Front
router.get("/", agencyController.getAll);
// Endpoints Postman
router.post("/", agencyController.create);
router.get("/:id", agencyController.getOne);

module.exports = router;