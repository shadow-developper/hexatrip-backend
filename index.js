require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectToDatabase = require("./database");
const multer = require("multer");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

// Routes
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checkoutRoutes = require("./routes/checkout.routes");

// Configuration :
const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(helmet()); // Sécurité globale
app.use(xssClean()); // Supprimer les balises des données entrantes

// Ratelimit configuration :
const limitOptions = {
    windowMs: 15* 60 * 1000, // 15 minutes
    max: 100, // 100 Requêtes max par périodes de 15minutes
    handler: (req,res) => {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({ status: 429, error: "Too many requests"});
    }, // Trop de reqiêtes 
    standardHeaders: true, // Inclure dans la réponse des headers la description du ratelimit
    legacyHeaders: false,
};
app.use(rateLimit(limitOptions));

// CORS configuration 
const allowedOrigins = ["https://hexatrip.netlify.app", "http://localhost:3000"] // REVENIR POUR FIXER L'ADRESSE DU SITE WEB NETLIFY
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            //Origine acceptées
            callback(null, true)
        } else {
            // Origine non authorisée
            callback(new Error("Not allowed by CORS"));
        }
    }, //Verifier si l'origine de la requête est authorisée
    methods: ["GET", "POST", "PATCH", "DELETE"], // Uniquement les méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization", "x-forwarded-for"], // Authorise uniquement les requêtes avec certains headers
    credentials: true, // Authorise ou non l'échange de cookies et les headers d'authentification
};
app.use(cors(corsOptions));

// Connexion DB
connectToDatabase();

// Configuration Multer
app.locals.uploader = multer({
    storage: multer.memoryStorage({}),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are accepted"));
        }
    },
});

// Endpoints
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/create-checkout-session", checkoutRoutes);


// 404
app.use((req, res) => {
    return res.status(404).send("Page not found");
});

// Server start
app.listen(port, () => {
    console.log(`Hexatrip server running on port ${port}`);
});