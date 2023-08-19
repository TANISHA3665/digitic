const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt  = require('jsonwebtoken');

const createUser = async (req, res) =>
{
    try
    {
        const email = req.body.email;
        const findUser = await User.findOne({ email });

        if (!findUser)
        {
            const newUser = await User.create(req.body);
            res.status(201).send(newUser);
        }
        else
        {
            throw new Error("User already exists");
        }
    } catch (error) {
        res.status(400).send({
            error: error.message,
            stack: error.stack
        });
    }
};

const loginUser = async (req, res) =>
{
    try
    {
        const { email, password } = req.body;

        //check if user exists
        const findUser = await User.findOne({ email: email });
        if (findUser && await findUser.isPasswordMatched(password))
        {
            const refreshToken = generateRefreshToken(findUser._id);
            const updateUser = await User.findByIdAndUpdate(findUser._id, { refreshToken: refreshToken }, { new: true });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});

            res.status(200).send({
                _id: findUser?._id,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                email: findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id)
            });
        } else
        {
            throw new Error("Invalid credentials")
        }
    } catch (error)
    {
        res.status(400).send({
            error: error.message,
            stack: error.stack
        });
    }
}

const handleRefreshToken = async (req, res) =>
{
    try {
        const cookie = req.cookies;
        if (!cookie?.refreshToken) throw new Error("No refresh token in cookie");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken: refreshToken });
        console.log(user);
        if (!user) throw new Error("No refresh token in db or matched");
        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) =>
        {
            console.log(decoded);
            if (err || (decoded.id != user._id))
            {
                throw new Error("There is something wrong with refresh token");
            }
            const accessToken = generateToken(user?._id);
            res.send({ accessToken });
        });
    } catch (error) {
        res.status(400).send({
            error: error.message,
            stack: error.stack
        })
    }
};

const getAllUsers = async (req, res) =>
{
    try {
        const allUsers = await User.find();
        res.status(200).send(allUsers);
    } catch (error) {
        res.status(400).send({ error: error.message, stack: error.stack });
    }
}

const getAUser = async (req, res) =>
{
    try {
        const { id } = req.params;
        validateMongoDbId(id);

        const user = await User.findById(id);

        if (!user)
        {
            throw new Error("User not found");
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message, stack: error.stack });
    }
}

const deleteAUser = async (req, res) =>
{
    try {
        const { id } = req.params;
        validateMongoDbId(id);

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser){ 
            throw new Error("User does not exist");
        }

        res.status(200).send({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(400).send({ error: error.message, stack: error.stack });
    }
}

const updateAUser = async (req, res) =>
{
    try {
        const { _id } = req.user;
        validateMongoDbId(_id);

        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            role: req?.body?.role
        },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found")
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(400).send({ error: error.message, stack: error.stack });
    }
}

const blockAUser = async (req, res) =>
{ 
    try
    {
        const { id } = req.params;
        validateMongoDbId(id);

        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found")
        }

        if (user.isBlocked) {
            throw new Error("User is already blocked")
        }

        const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.status(200).send({ message: "User blocked successfully", blockedUser: blockedUser });

    } catch (error)
    {
        res.status(400).send({ error: error.message, stack: error.stack });
    } 
}

const unblockAUser = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        validateMongoDbId(id);

        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found")
        }

        if (!(user.isBlocked)) {
            throw new Error("User is already unblocked")
        }

        const unblockedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.status(200).send({ message: "User unblocked successfully", unblockedUser: unblockedUser });

    } catch (error)
    {
        res.status(400).send({ error: error.message, stack: error.stack });
    } 
};



module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getAUser,
    deleteAUser,
    updateAUser,
    blockAUser,
    unblockAUser,
    handleRefreshToken
}