const express = require("express");
const router = express.Router();
const {addFollow, removeFollow, getFollowers, getFollowing} = require("../controller/followController"); 
const {followLimiter} = require("../middleware/rateLimiter");

router.post("/add",followLimiter, addFollow);

router.delete("/remove", removeFollow);

router.get("/followers", getFollowers);

router.get("/following", getFollowing);

module.exports = router;
