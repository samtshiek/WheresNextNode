const User = require("../UserSchema")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
require('dotenv').config();

// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

// Create a user
const createNewUser = async (req, res) => {
    try {
        console.log(req.body)
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
        console.error(err)
    }
}

// Get a user by id
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)
    console.log(user)
    if (!user) {
        return res.status(204).json({ message: `No user matches ID ${req.params.id}.` })
    }
    res.json(user)
}

const userLogin = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({ username }).lean()

    if (!user) return res.status(401).json({ status: 'error', message: "Invalid username/password" })
    // if username & password match one user in the DB
    if (await bcrypt.compare(password, user.password)) {
        user.id = user._id
        delete user.password
        delete user._id
        const accessToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h'})
        return res.json(accessToken)
    }
    return res.status(401).json({ status: 'error', message: "Invalid username/password" })
}

module.exports = {
    getAllUsers,
    createNewUser,
    getUserById,
    userLogin,
}