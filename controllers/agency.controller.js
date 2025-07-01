const { StatusCodes } = require("http-status-codes");
const Agency = require("../models/Agency");
const path = require("path");
const fs = require("fs").promises;

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
};

const addImage = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    // Sortir du controller s'il n'y a pas d'ID
    if(!id){
        return res.status(StatusCodes.BAD_REQUEST).send("No ID provided. Faillure");
    }

    // Trouver l'avis qui correspond
    let agency;
    try {
    agency = await Agency.findById(id);
    if (!agency) {
        return res.status().send("No agency found. Failure");
    }
    } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching agency");
    }
    // Si quelque chose ne va pas 
    if(!file || Object.keys(agency).lenght === 0){
        return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure");
    }

    // Sauvegarder l'image dans la node et l'attacher au bon avis dans la database
    try {
        const uploadPath = path.join(__dirname, "../public/images/agencies", id, file.originalname);
        const directory = path.dirname(uploadPath);
        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(uploadPath, file.buffer);
        agency.photo = file.originalname;
        await agency.save();
        return res.status(StatusCodes.CREATED).send("File attached successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
    }
};

module.exports = { create, getAll, getOne, addImage }; // Export des fonctions pour pouvoir l'utiliser dans les routes