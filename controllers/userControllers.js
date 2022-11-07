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
        // choice: [extrovert/introverted, outdoor/indoor, active/inactive, sensitive/insensitive]
        // If value's positive, I'll add the value to the front one, otherwise the back one.
        a1:  [2, 0, 2, 0],
        b1:  [-1, 0, -5, 0],
        c1:  [1, 0, 0, 0],
        d1:  [3, 0, 2, 0],

        a2:  [5, 0, 2, 0], // Restaurant 5
        b2:  [1, 0, 0, 0], // Restaurant 3
        c2:  [-1, 0, 0, 0],
        d2:  [-5, 0, 0, 0],

        a3:  [4, 0, 2, 0],
        b3:  [1, 0, 0, 0],
        c3:  [0, 0, -5, 0],
        d3:  [-2, 0, 0, 0],

        a4:  [0, 0, 0, 3], // Museum 5
        b4:  [0, 0, 0, 0], // Museum 3
        c4:  [0, 0, 0, 0],
        d4:  [0, 0, 0, 0], // Museum -5

        a5:  [0, 5, 0, 0], // Park 5 Trail 5
        b5:  [0, 3, 0, 0], // Park 3 Trail 3
        c5:  [0, 0, 0, 0],
        d5:  [0, -5, 0, 0], // Park -5 Trail -5

        a6:  [0, 0, 4, 0],
        b6:  [0, 0, 1, 0],
        c6:  [0, 0, -1, 0],
        d6:  [0, 0, 0, 0], // Trail 3

        a7:  [3, 0, 5, 0],
        b7:  [1, 0, 2, 0],
        c7:  [-2, 0, 0, 0],
        d7:  [-3, 0, -4, 0],

        a8:  [2, 0, -1, 0],
        b8:  [2, 0, 5, 0], // Bar 5
        c8:  [2, 0, 0, 0], // Bar 2
        d8:  [0, 0, 0, 0], // Bar -5

        a9:  [5, 0, 0, 0], // Coffee shop 5
        b9:  [3, 0, 0, 0], // Coffee shop 3
        c9:  [0, 0, 0, 0],
        d9:  [0, 0, 0, 0], // Coffee shop -5

        a10: [0, 1, 5, 0],
        b10: [0, 5, 3, 0], // Trail 5
        c10: [0, 0, 1, 0],
        d10: [0, 0, -5, 0], // Movie theater 2
    }
    const ansArray = ['a1', 'b2', 'c3']// req.body.ansArray
    ansArray.forEach(function(item) {
        // choice: [extrovert/introverted, outdoor/indoor, active/inactive, sensitive/insensitive]
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
        if (grade[2] > 0){
            user.preference.sensitive += grade[3]
        } else {
            user.preference.insensitive += grade[3] * -1
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