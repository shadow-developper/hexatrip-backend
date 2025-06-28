const mongoose = require("mongoose");

const mongoUriAtlas = ``; // A définir lors de la mise en production
const mongoUriLocalhost = `mongodb://localhost:27017/hexa-trip`; // Connection à la base de donnée locale

let mongoUri = ``;

const connectToDatabase = async () => {
    if (process.env.NODE_ENV === "production") { // Si le mode utilisé est le mode production : Utiliser l'URI MongoDB Atlas
        mongoUri = mongoUriAtlas;
    } else { // Sinon, on utilise l'URI MongoDB locale
        mongoUri = mongoUriLocalhost; 
    }

    try {
        await mongoose.connect(mongoUri, { // On essaye de se connecter à la base de donnée
            dbName: "hexa-trip",
            tls: process.env.NODE_ENV === "production", 
        });
        console.log("Connection with database successful"); // Nous sommes bien connecté à la base de donnée
    } catch (error) {
        console.error("Error during database connection:", error);
    }
};

module.exports = connectToDatabase;
