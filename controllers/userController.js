const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');

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
            res.status(409).send({
                msg: "User already exists",
                success: false
            });
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
            res.status(400).send({
                error: "Invalid Credentials"
            });
        }
    } catch (error)
    {
        res.status(400).send({
            error: error.message,
            stack: error.stack
        });
    }
}

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
        const user = await User.findById(id);

        if (!user)
        {
            res.status(400).send({ error: 'User not found' });
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
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser){ 
            res.status(400).send({ error: "User does not exist" });
        }

        res.status(200).send({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(400).send({ error: error.message, stack: error.stack });
    }
}

const updateAUser = async (req, res) =>
{
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            role: req?.body?.role
        },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).send({ error: 'User not found' });
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(400).send({ error: error.message, stack: error.stack });
    }
}


module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getAUser,
    deleteAUser,
    updateAUser
}