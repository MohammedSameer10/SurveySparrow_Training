const express = require("express");
const router = express.Router();
const { createPost, updatePost, deletePost, getFeeds, searchPosts, searchMyPost} = require("../controller/postController");
const upload = require('../middleware/uploadDiskStorage')
// const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

router.post("/create", upload.single("image"), createPost);

router.put("/update/:id", upload.single("image"), updatePost);

router.delete("/delete/:id", deletePost);

router.get("/getFeeds", getFeeds);

router.get("/search", searchPosts);

router.get("/searchMyPost", searchMyPost);


module.exports = router;
