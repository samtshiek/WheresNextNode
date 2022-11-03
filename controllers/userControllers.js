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

// Store quiz result to DB
const gradeQuiz = async (req, res) => {
    let user = await User.findById('6363323c70d6f57eb1da92c1')//req.body.id)
    const gradeTable = {
        // choice: [introverted, outdoor, active]
        // If value's positive, I'll add the value to these three, otherwise, extroverted, indoor, inactive.
        a1: [-1, 1, 1],
        b1: [1, 1, 1],
        c1: [1, 1, 1],
        d1: [1, 1, 1],
        a2: [1, 1, 1],
        b2: [1, 1, 1],
        c2: [1, 1, 1],
        d2: [1, 1, 1],
        a3: [1, 1, 1],
        b3: [1, 1, 1],
        c3: [1, 1, 1],
        d3: [1, 1, 1],
        a4: [1, 1, 1],
        b4: [1, 1, 1],
        c4: [1, 1, 1],
        d4: [1, 1, 1],
        a5: [1, 1, 1],
        b5: [1, 1, 1],
        c5: [1, 1, 1],
        d5: [1, 1, 1],
        a6: [1, 1, 1],
        b6: [1, 1, 1],
        c6: [1, 1, 1],
        d6: [1, 1, 1],
        a7: [1, 1, 1],
        b7: [1, 1, 1],
        c7: [1, 1, 1],
        d7: [1, 1, 1],
        a8: [1, 1, 1],
        b8: [1, 1, 1],
        c8: [1, 1, 1],
        d8: [1, 1, 1],
        a9: [1, 1, 1],
        b9: [1, 1, 1],
        c9: [1, 1, 1],
        d9: [1, 1, 1],
        a10: [1, 1, 1],
        b10: [1, 1, 1],
        c10: [1, 1, 1],
        d10: [1, 1, 1],
        a11: [1, 1, 1],
        b11: [1, 1, 1],
        c11: [1, 1, 1],
        d11: [1, 1, 1],
    }
    const ansArray = ['a1', 'b1', 'c1']// req.body.ansArray
    ansArray.forEach(function(item) {
        // choice: [introverted, outdoor, active]
        grade = gradeTable[item]
        if (grade[0] > 0){
            user.preference.introverted += grade[0]
        } else {
            user.preference.extroverted += grade[0] * -1
        }
        if (grade[1] > 0){
            user.preference.outdoor += grade[1]
        } else {
            user.preference.indoor += grade[1] * -1
        }
        if (grade[2] > 0){
            user.preference.active += grade[2]
        } else {
            user.preference.inactive += grade[2] * -1
        }
    })
    user.save();
    res.json(user)
}

module.exports = {
    getAllUsers,
    createNewUser,
    getUserById,
    gradeQuiz,
}