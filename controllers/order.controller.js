// Import des codes HTTP standards (200, 500, etc.)
const { StatusCodes } = require("http-status-codes");

// Import du modèle Order (commande)
const Order = require("../models/Order");

// Fonction qui récupère toutes les commandes
const getAll = async (req, res) => {
    try {
        // Récupère toutes les commandes, et ajoute les infos du trip lié
        const orders = await Order.find({}).populate("trip");

        // Envoie les commandes au client avec un code 200 (OK)
        return res.status(StatusCodes.OK).send(orders);
    } catch (error) {
        // En cas d'erreur, log côté serveur et réponse 500 au client
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching orders");
    }
};

module.exports = { getAll }; // Export de la fonction pour pouvoir l'utiliser dans les routes
