const express = require("express");

const { addLike, removeLike, getUserLikes} = require("../controller/likeController");

const router = express.Router();

router.post("/add", addLike);

router.delete("/remove", removeLike);

router.get("/getUserLikes", getUserLikes);

module.exports = router;
