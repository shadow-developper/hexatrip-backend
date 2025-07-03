// Charger les variables d'environnement le plus tôt possible
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectToDatabase = require("./database");
const multer = require("multer");

// Routes
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");

// App
const app = express();
const port = 3000;

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

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

// 404
app.use((req, res) => {
    return res.status(404).send("Page not found");
});

// Server start
app.listen(port, () => {
    console.log(`Hexatrip server running on port ${port}`);
});