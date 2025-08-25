const express = require("express");

const { addLike, removeLike, getUserLikes} = require("../controller/likeController");
const validate = require('../middleware/validate');
const { likeAddValidation, likeRemoveValidation } = require('../middleware/validators');

const router = express.Router();

router.post("/add", likeAddValidation, validate, addLike);

router.delete("/remove", likeRemoveValidation, validate, removeLike);

router.get("/getUserLikes", getUserLikes);

module.exports = router;
