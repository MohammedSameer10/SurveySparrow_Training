const express = require("express");
const router = express.Router();
const followerController = require("../controller/followController"); 

router.post("/add", followerController.addFollow);

router.delete("/remove", followerController.removeFollow);

router.get("/followers", followerController.getFollowers);

router.get("/following", followerController.getFollowing);

module.exports = router;
