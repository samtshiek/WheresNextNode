const User = require("../UserSchema")
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const bcrypt = require("bcrypt")


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
        const accessToken = jwt.sign({ user }, JWT_SECRET)
        // res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        // return res.json(accessToken)
        console.log(user) 
        return res.status(201).send(user)
    }
    return res.status(401).json({ status: 'error', message: "Invalid username/password" })
}

const userLogout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/')
}

module.exports = {
    userLogin,
    userLogout,
}