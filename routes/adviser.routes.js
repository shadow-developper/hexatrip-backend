// Import d'Express et création du routeur
const express = require("express");
const router = express.Router();
const adviserController = require("../controllers/adviser.controller");
const singleFileUploaderMiddleware = require("../middlewares/simpleUploader");


// Endpoints pour le front
router.get("/", adviserController.getAll);
router.get("/:id", adviserController.getOne);

// Endpoints pour postman
router.post("/", adviserController.create);
router.post("/:id", singleFileUploaderMiddleware, adviserController.addImage);

module.exports = router;