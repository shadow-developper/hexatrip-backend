const { StatusCodes, NOT_FOUND } = require("http-status-codes");
const Trip = require("../models/Trip");
const { categoryCodes, tagCodes } = require("../helpers/data"); // Assure-toi d'avoir tagCodes si tu veux filtrer par tag
const path = require("path");
const fs = require("fs").promises;

const getAll = async (req, res) => {
    const params = req.query;
    let formattedParams = {};
    // Région
    if (params.region && params.region !== "0") {
        const region = parseInt(params.region);
        if (!isNaN(region)) {
            formattedParams.region = region;
        }
    }
    // Durée
    if (params.duration && params.duration !== "0") {
        const duration = parseInt(params.duration);
        if (!isNaN(duration)) {
            formattedParams.duration = duration;
        }
    }
    // Ville
    if (params.town) {
        formattedParams.town = { $regex: params.town, $options: "i" }; // 'i' pour insensible à la casse
    }
    // Prix max
    if (params.price) {
        const price = parseFloat(params.price);
        if (!isNaN(price)) {
            formattedParams.adultPrice = { $lte: price };
        }
    }
    // Catégorie
    if (params.category && params.category !== "0") {
        const category = categoryCodes.find((cat) => cat.code === parseInt(params.category));
        if (category) {
            formattedParams.category = category.name;
        }
    }
    if (params.tags && params.tags !== "0") {
        const tag = tagCodes?.find((tag) => t.code === parseInt(params.tags)); // Vérifie si tagCodes existe
        if (tag) {
            formattedParams.tags = tag.name;
        }
    }
    try {
        const trips = await Trip.find(formattedParams);
        return res.status(StatusCodes.OK).send(trips);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching trips");
    }
};

const getAllBestsellers = async (req,res) => {
    try {
        const trips = await Trip.find({tags:"bestseller" });
        return res.status(StatusCodes.OK).send(trips);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching bestsellers");
    }
}

const create = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
        }
        const trip = await Trip.create(req.body);
        return res.status(StatusCodes.CREATED).json({ message: "Trip created", trip });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Creation failed");
    }
};

const getOne = async (req,res) => {
        const id = req.params.id;
        if(!id){
            return res.status(StatusCodes.BAD_REQUEST).send("No ID provided")
        }
        try {
            const trip = await Trip.findById(id);
            if(!trip){
                return res.status(StatusCodes.BAD_REQUEST).send("No match");
            }
            return res.status(StatusCodes.OK).send(trip);
        } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while retrieving the trip");
    }
};

const patchOne = async (req,res) => {
    const id = req.params.id;
    if(!id){
    return res.status(StatusCodes.BAD_REQUEST).send("No ID provided")
    }
    try {
        const trip = await Trip.findByIdAndUpdate(id, req.body, { new:true });
        if(!trip){
            return res.status(StatusCodes.NOT_FOUND).send("No ressource find");
        }
        return res.status(StatusCodes.OK).send(trip);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while patching the trip");
    }
};

const deleteOne = async (req,res) => {
    const id = req.params.id;
    if(!id){
    return res.status(StatusCodes.BAD_REQUEST).send("No ID provided")
    }
    try {
        const trip = await Trip.findByIdAndDelete(id);
        if(!trip){
            return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
        }
        return res.status(StatusCodes.OK).send(trip);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while deleting the trip");
    }
};

const deleteAll = async (req,res) => {
    try {
        const result = await Trip.deleteMany();
        if(result.deletedCount === 0){
            return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
        }
        return res.status(StatusCodes.OK).send("All deleted");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while deleting all the trips");
    }
};

const addImages = async (req, res) => {
    const { id } = req.params;
    const files = req.files;

    // Sortir du controller s'il n'y a pas d'ID
    if(!id){
        return res.status(StatusCodes.BAD_REQUEST).send("No ID provided. Faillure");
    }

    // Trouver l'avis qui correspond
    let trip;
    try {
    trip = await Trip.findById(id);
    if (!trip) {
        return res.status().send("No trip found. Failure");
    }
    } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching agency");
    }
    // Si quelque chose ne va pas 
    if(!files || files.length === 0 || Object.keys(trip).lenght === 0){
        return res.status(StatusCodes.BAD_REQUEST).send("No upload/trip. Failure");
    }

    // Sauvegarder l'image dans la node et l'attacher au bon avis dans la database
    try {
        await Promise.all(        
            files.map(async (file) => { 
            const uploadPath = path.join(__dirname, "../public/images/trips", id, file.originalname);
            const directory = path.dirname(uploadPath);
            await fs.mkdir(directory, { recursive: true });
            await fs.writeFile(uploadPath, file.buffer);
           trip.images.push(file.originalname);
    }))

        await trip.save();
        return res.status(StatusCodes.CREATED).send("Files attached successfully");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
    }
};

module.exports = { create, getAll, getOne, getAllBestsellers, patchOne, deleteOne, deleteAll, addImages };