const express = require('express');
const router = express.Router();
const User = require("../UserSchema");
require('dotenv').config();

// mongoDB connection
const mongoose = require("mongoose");

let mongoDBURI = process.env.mongoDBURI;
mongoose.connect(mongoDBURI).then(
    () => {
        console.log("Database connection established!");
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);

// Create user
async function createUser() {
    try {
        const user = await User.create({username: "jerry123", password: "jerry456", name: "Jerry", createdAt: Date.now()});
        console.log(user)
    } catch (err) {
        console.log(err.message)
    }
}
// createUser()


router.get('/users', function(req, res) {
    User.find({}).then((users) => {
        console.log(users)
        res.status(200).json({users});
    }).catch((err) => {
        res.status(500).send({
            message: err.message
        });
    });
});

module.exports = router;