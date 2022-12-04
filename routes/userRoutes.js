const express = require('express');
const router = express.Router();
const User = require("../controllers/userControllers");
const auth = require("../middleware/auth")

router.get("/", User.getAllUsers);
router.get("/:id", User.getUserById);
router.get("/:id/:scale", User.getPercentage);
router.get("/get-place/id/:placeId", User.getPlace);
router.get("/get-favorite-place/:place", User.getFavoritePlace);
router.post("/create", User.createNewUser);
router.post("/submit-quiz", User.gradeQuiz);
router.post("/get-recommendations", User.sortQueryResultByPreference);
router.post("/update_user/", User.editUser);
router.post("/get-places", User.getPlaceList);
router.post("/get-places-advanced", User.getPlacesAdvanced);
router.post("/add-place-to-favorite", User.addPlaceToFavorite);
router.post("/remove-favorite", User.removePlaceFromFavorite);



module.exports = router;