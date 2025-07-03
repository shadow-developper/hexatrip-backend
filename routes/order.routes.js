const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticateMiddleware } = require("../middlewares/authenticationMiddleware");

// Route GET pour récupérer toutes les commandes
router.get("/", authenticateMiddleware, orderController.getAll);

// Export du routeur pour l'utiliser ailleurs
module.exports = router;
