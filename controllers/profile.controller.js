const { StatusCodes, NOT_FOUND } = require("http-status-codes");
const User = require("../models/User");

// User routes
const getProfile = async (req,res) => {
    const middlewareUser = req.user;
    return res.status(StatusCodes.OK).send(middlewareUser);
};

const updateProfile = async (req,res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, data,{new: true, select: '-password -__v'}
);

        return res.status(StatusCodes.OK).send(user);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.NOT_FOUND).send("No ressource found");
    }
}
module.exports = { getProfile, updateProfile };