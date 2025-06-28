// Import d'Express et création d'un routeur
const express = require("express");
const router = express.Router();

// Import du contrôleur pour gérer les commandes
const orderController = require("../controllers/order.controller");

// Route GET pour récupérer toutes les commandes
router.get("/", orderController.getAll);

// Export du routeur pour l'utiliser ailleurs
module.exports = router;
