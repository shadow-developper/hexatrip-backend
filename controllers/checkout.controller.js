const { StatusCodes } = require("http-status-codes");
const { hotelTax } = require("../helpers/data");
const Trip = require("../models/Trip");
const Order = require("../models/Order");
const Stripe = require("stripe");

const createStripeSession = async (req,res) => {
    try {
        // Initialiser la session Stripe

        // Importer tout ce qui a été envoyé par le client

        // Récupérer le voyage vendu dans la transaction à partir de la base de données items est un tableau d'un seul élément : items[0] qui est le voyage

        // Faire la transaction via Stripe

        // Pendant que le bon de commande est dans la base de données (en mode « non connecté/visiteur » et en mode connecté)

        // Sortir
    } catch (error) {
        
    }
};

module.exports = { createStripeSession };