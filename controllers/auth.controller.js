const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const saltRounds = 10; // Puissance du hashage

const register = async (req,res) => {
    try {
        const { username, email, password, role} = req.body;
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
            password: hashedPassword,
            role,
        };
        await User.create(user);
        return res.status(StatusCodes.CREATED).send("User registred");
    } catch (error) {
        console.log(`Error in user registration : ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred during registration");
    }
};

const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        // On regarde s'il y a des champs manquants
        if(!email || !password){
            return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
        }
        // Vérification que l'utilisateur existe bien
        const foundUser = await User.findOne( { email });
        if(!foundUser){
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");
        }
        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch){
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");
        }
        // Tout va bien, nous envoyons donc les données sous forme de jeton à l'utilisateur
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(
            {
                id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email
            },
            jwtSecretKey, 
            { expiresIn: "1h"} // Le token expire dans 1 heure
        );
        // Strip l'utilisateur trouvé de son mot de passe et de la version interne
        const { password: _, __v, ...userWithoutSensitiveData } = foundUser._doc;
        return res.status(StatusCodes.OK).send({ user: userWithoutSensitiveData, token});
    } catch (error) {
        console.log(`Error in user login : ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred during login");
    }
};

module.exports = { register, login };