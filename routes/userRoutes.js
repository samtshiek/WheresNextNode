const express = require('express');
const router = express.Router();
const User = require("../controllers/userControllers");
const auth = require("../middleware/auth")

router.get("/", User.getAllUsers);
router.get("/:id", User.getUserById);
router.post("/create", User.createNewUser);
router.post("/submit-quiz", User.gradeQuiz)


module.exports = router;