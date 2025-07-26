require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectToDatabase = require("./database");
const multer = require("multer");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Routes
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checkoutRoutes = require("./routes/checkout.routes");

// Middleware perso pour échapper les chaînes (prévention XSS simple)
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = escapeHTML(obj[key]);
    } else if (typeof obj[key] === "object") {
      obj[key] = sanitizeObject(obj[key]);
    }
  }
  return obj;
}

// App
const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(helmet());

// Middleware pour nettoyage XSS simple sur req.body et req.params
app.use((req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
});

// Middleware pour nettoyage MongoDB injection
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
  }
  next();
});

// Ratelimit configuration
const limitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({ status: 429, error: "Too many requests" });
  },
  standardHeaders: true,
  legacyHeaders: false,
};
app.use(rateLimit(limitOptions));

// CORS configuration
const allowedOrigins = [
  "https://hexatrip.netlify.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-forwarded-for"],
  credentials: true,
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

// Routes
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
