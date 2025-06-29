const express = require ("express"); // Framework pour gérer les routes
const morgan = require("morgan"); // Middleware pour la journalisation des requêtes
const bodyParser = require("body-parser");
const connectToDatabase = require("./database"); // Connection à la DB
const multer = require("multer");

//  Routes 
const orderRoutes = require("./routes/order.routes"); // Routeur des commandes
const adviserRoutes = require("./routes/adviser.routes"); // Routeur des avis
const agencyRoutes = require("./routes/agency.routes");  // Routeur des agences
const tripRoutes = require("./routes/trips.routes"); // Routeur des voyages

// Constance
const app = express();

// Configuration
const port = 3000; // Définition du port d'écoute
app.use(morgan("dev")); // Utilisation de morgan pour afficher les logs des requêtes HTTP
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connection à la database
connectToDatabase();

// Configuration multer
app.locals.uploader = multer({
    storage: multer.memoryStorage({}),
    limits: {fileSize: 10 * 1024*1024}, // Taille maximale pour l'imports de fichiers (Photos...), ici de 10 Mo
    fileFilter: (req, res, cb) => {
        // Accepte uniquement les images
        if(file.minetype.startWith("image/")) {
            cb(mull,true);
        } else {
            cb(new Error("Only images are accepted"));
        }
    }
})

// Endpoints
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);

//  Catch all (Si aucun endpoint est intercepté)
app.use((req,res) => {
    return res.status(404).send("Page not fond");
})

//  Heartbeat
app.listen(port, () => {
    console.log(`Hexatrip server running on port ${port}`); // Log lorsque le serveur est en ligne, et écoute sur le port 3000
});