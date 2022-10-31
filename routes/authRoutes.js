const express = require('express');
const auth = require("../controllers/authControllers");
const router = express.Router();

router.post("/login", auth.userLogin);
router.get("/logout", auth.userLogout);

module.exports = router;