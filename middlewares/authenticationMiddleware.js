const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const authenticateMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("authorization");
        // S'il n'y a pas de token attaché :
        if(!authHeader){
            return res.status(StatusCodes.BAD_REQUEST).send("Authentification failed");
        }
        // Si le token est valide
        const jwtSecretKey = process.env.JWTY_SECRET_KEY
        const token = authHeader.split(" ")(1);
        const userByToken = jwt.verify(token, jwtSecretKey);
        const userInDB = await User.findById(userByToken.id).select("password - __v - updatedAt");
        // Attacher à la requête
        req.user = userInDB;
        next();
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).send("Authentification failed");
    }
};

module.exports = { authenticateMiddleware };