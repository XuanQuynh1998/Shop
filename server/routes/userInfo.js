const express = require("express");
const router = express.Router();

const userInfoController = require("../controllers/userInfoController.js");

///testtt

router.get("/profile", userInfoController.profile);
router.post("/profile/update", userInfoController.updateProfile);
router.get("/get_avatar", userInfoController.getUserAvatar);
router.get("/get_username", userInfoController.getUsername);
router.get("/addresses/get_addresses/:id", userInfoController.getUserAddresses);
router.get("/addresses/get_addresses", userInfoController.getAllUserAddresses);
router.post("/addresses/set_default", userInfoController.setDefaultAddresses);
router.get("/addresses/get_location/:type", userInfoController.getLocation);
router.post("/addresses/set_location", userInfoController.setLocation);
router.post("/addresses/edit_location", userInfoController.editLocation);
router.get("/addresses/remove_location/:id", userInfoController.removeLocation);
router.get("/search", userInfoController.searchOrder);

module.exports = router;
