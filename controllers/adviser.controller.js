const { StatusCodes } = require("http-status-codes");
const Adviser = require("../models/Adviser");
const path = require("path");
const fs = require("fs");

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
};

const addImage = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    // Sortir du controller s'il n'y a pas d'ID
    if(!id){
        return res.status(StatusCodes.BAD_REQUEST).send("No ID provided. Faillure");
    }

    // Trouver l'avis qui correspond
    let adviser;
    try {
    adviser = await Adviser.findById(id);
    if (!adviser) {
        return res.status().send("No adviser found. Failure");
    }
    } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching advisers");
    }
    // Si quelque chose ne va pas 
    if(!file || Object.keys(adviser).lenght === 0){
        return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure");
    }

    // Sauvegarder l'image dans la node et l'attacher au bon avis dans la database
    try {
        const uploadPath = path.join(__dirname, "../public/images/advisers", id, file.originalname);
        const directory = path.dirname(uploadPath);
        fs.mkdir(directory, { recursive: true }, () => {});
        fs.writeFile(uploadPath, file.buffer, () => {});
        adviser.image = file.originalname;
        await adviser.save();
        return res.status(StatusCodes.CREATED).send("File attached successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
    }
};

module.exports = { create , getAll, getOne}; // Export des fonctions pour pouvoir l'utiliser dans les routes
