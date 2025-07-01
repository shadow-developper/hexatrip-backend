const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const saltRound = 10; // Puissance du hashage

const register = async (req,res) => {
    try {
        const { username, email, password} = req.body;
        // On regarde s'il y a des champs manquants
        if(!username ||!email || !password){
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
        }
        // Vérification que l'utilisateur n'existe toujours pas 
        const foundUser = await User.findOne( { email });
        if(foundUser){
            return res.status(StatusCodes.BAD_REQUEST).send("Registration failed : Your are already registered");
        }
        // Cryptage du password à l'aide de bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Création de l'utilisateur
        const user = {
            username,
            email,
            password: hashedPassword
        };
        await User.create(user);
        return res.status(StatusCodes.CREATED).send("User registred");
    } catch (error) {
        console.log(`Error in user registration : ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred during registration");
    }
};

const login = async (req,res) => {
    
};

module.exports = { register, login };