const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) =>
{
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token)
            {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            res.status(401).send({error: jwt.TokenExpiredError})
        }
    }
    else
    {
        res.status(400).send({ error: "There is no token attached to header" });
    }
};

const isAdmin = async (req, res, next) =>
{
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (user.role.toLowerCase() !== 'admin')
    {
        res.status(401).send({ error: "You are not an admin" });
    }
    else
    {
        next();
    }
}

module.exports = { authMiddleware, isAdmin };