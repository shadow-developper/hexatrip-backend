// Import d'Express et création d'un routeur
const express = require("express");
const router = express.Router();
const tripController = require ("../controllers/trip.controller");

// Frontend :
router.get("/", tripController.getAll);
router.get("/bestsellers", tripController.getAllBestsellers);

// Postman
router.post("/", tripController.create);
router.get("/:id", tripController.getOne)
router.patch("/:id", tripController.patchOne);
router.delete("/:id", tripController.deleteOne);
router.delete("/", tripController.deleteAll);

module.exports = router;