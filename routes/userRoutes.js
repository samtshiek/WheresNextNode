const express = require('express');
const router = express.Router();
const User = require("../controllers/userControllers");
const auth = require("../middleware/auth")

router.get("/", auth.authenticateToken, User.getAllUsers);
router.get("/:id", auth.authenticateToken, User.getUserById);
router.post("/create", User.createNewUser);
router.post("/login", User.userLogin);



module.exports = router;