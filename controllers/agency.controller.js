// Import des codes HTTP standards (200, 500, etc.)
const { StatusCodes } = require("http-status-codes");
// Import du modèle Agency (Agences)
const Agency = require("../models/Agency");

// Endpoints Front
const getAll = async (req,res) => { // Récupérations de toutes les agences
    try {
        const agencies = await Agency.find(); // Recherche des agences
        return res.status(StatusCodes.OK).send(agencies); // Affichage des agences
    } catch (error) { // Si nous avons une erreur : Affichage de l'erreur
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching agencies");
    }
}
// Endpoints Postman
const create = async (req, res) => {
    try {
        const agencies = await Agency.create(req.body);
        return res.status(StatusCodes.CREATED).send("Agency created");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Creation failed while retrieving agencies");
    }
}

const getOne = async (req,res) => { // Recherche d'un avis spécifique
    try {
        const { id } = req.params; // Permet de rechercher un avis avec son ID
        const agency = await Agency .findById(id);
        if (!agency){ // Si l'avis n'existe pas : Affichage d'un message d'erreur 
            return res.status(StatusCodes.BAD_REQUEST).sen("No match");
        }
        return res.status(StatusCodes.OK).send(agency);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error fetching agency");
    }
}

module.exports = { create, getAll, getOne }; // Export des fonctions pour pouvoir l'utiliser dans les routes