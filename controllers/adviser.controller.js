// Import des codes HTTP standards (200, 500, etc.)
const { StatusCodes } = require("http-status-codes");
// Import du modèle Adviser (avis)
const Adviser = require("../models/Adviser");

// Endpoints pour le front
const getAll = async (req, res) => { // Récupération de tous les avis
    try {
        const params = req.query;
        let formattedParams = {};
        if (params.town) {
            formattedParams.tags = { $regex: params.town, $options: "i" };
        }
        const advisers = await Adviser.find(formattedParams); 
        return res.status(StatusCodes.OK).send(advisers); // Affichage des avis
    } catch (error) { // Nous n'arrivons pas à récuperer les avis : Afffichage d'un message d'erreur
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching advisers");
    }
}

const getOne = async (req, res) => { // Recherche d'un avis spécifique
    try {
        const { id } = req.params; // Permet de rechercher un avis avec son ID
        const adviser = await Adviser.findById(id);
        if(!adviser){
            return res.status(StatusCodes.BAD_REQUEST);
        }
        return res.status(StatusCodes.OK).send(adviser); // Affichage de l'avis recherché
    } catch (error) {
        console.log(error); // Nous n'arrivons pas à récuperer l'avis : Afffichage d'un message d'erreur
        return res.status(StatusCodes.OK).send("Error retrieving adviser");
    }
}
// Endpoints pour postman
const create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name){
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
        }
        await Adviser.create(req.body);
        return res.status(StatusCodes.CREATED).send("Adviser created");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Creation failed");
    }
}

module.exports = { create , getAll, getOne}; // Export des fonctions pour pouvoir l'utiliser dans les routes
