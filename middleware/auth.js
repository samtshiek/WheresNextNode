const jwt = require("jsonwebtoken")
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401)

    jwt.verify(authHeader, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


module.exports = {
    authenticateToken
}