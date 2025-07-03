// Import d'Express et création d'un routeur
const express = require("express");
const router = express.Router();
const tripController = require ("../controllers/trip.controller");
const multipleFileUploaderMiddleware = require("../middlewares/complexUploader");
const { authenticateMiddleware } = require("../middlewares/authenticationMiddleware");
const { authorizeMiddleware } = require("../middlewares/authorizationMiddleware");

// Frontend :
router.get("/", tripController.getAll);
router.get("/bestsellers", tripController.getAllBestsellers);

// Postman
router.post("/", tripController.create);
router.get("/:id", tripController.getOne)
router.patch("/:id", tripController.patchOne);
router.delete("/:id", authenticateMiddleware, tripController.deleteOne);
router.delete("/", authenticateMiddleware,  authorizeMiddleware(["admin"]), tripController.deleteAll);
router.post("/:id", multipleFileUploaderMiddleware, tripController.addImages);

module.exports = router;