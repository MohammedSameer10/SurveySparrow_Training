const express = require("express");
const router = express.Router();
const { createPost, updatePost, deletePost, getFeeds, searchPosts, searchMyPost, getMyPosts} = require("../controller/postController");
const upload = require('../middleware/uploadDiskStorage')


router.post("/create", upload.single("image"), createPost);

router.put("/update/:id", upload.single("image"), updatePost);

router.delete("/delete/:id", deletePost);

router.post("/getFeeds", getFeeds);

router.post("/search", searchPosts);

router.post("/searchMyPost", searchMyPost);

router.get("/getMyPost", getMyPosts);



module.exports = router;
