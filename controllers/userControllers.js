const User = require("../UserSchema")
const bcrypt = require("bcrypt")
require('dotenv').config();

// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

// Create a user
const createNewUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const user = await User.create({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, salt),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            sex: req.body.sex,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            createdAt: Date.now()
        })

        res.status(201).json(user)
        console.log(user)
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'The username is already registered' })
        }
        return res.status(400).json({ message: err.message })
    }
}

// Get a user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(204).json({ message: `No user matches ID ${req.params.id}.` })
        }
        res.json(user)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}



module.exports = {
    getAllUsers,
    createNewUser,
    getUserById,
}