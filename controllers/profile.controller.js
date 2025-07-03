const { StatusCodes, NOT_FOUND } = require("http-status-codes");

// User routes
const getProfile = async (req,res) => {
    const middlewareUser = req.user;
    return res.status(StatusCodes.OK).send(middlewareUser);
};

module.exports = { getProfile };