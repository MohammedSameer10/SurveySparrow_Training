const express = require("express");
const router = express.Router();
const { createPost, updatePost, deletePost, getFeeds, searchPosts, searchMyPost, getMyPosts} = require("../controller/postController");
const upload = require('../middleware/uploadDiskStorage')
const validate = require('../middleware/validate');
const { postCreateValidation, postUpdateValidation, postDeleteValidation, searchPostsValidation, searchMyPostsValidation, getMyPostsValidation } = require('../middleware/validators');


router.post("/create", upload.single("image"), postCreateValidation, validate, createPost);

router.put("/update/:id", upload.single("image"), postUpdateValidation, validate, updatePost);

router.delete("/delete/:id", postDeleteValidation, validate, deletePost);

router.post("/getFeeds", getFeeds); 

router.post("/search", searchPostsValidation, validate, searchPosts);

router.post("/searchMyPost", searchMyPostsValidation, validate, searchMyPost);

router.get("/getMyPost", getMyPostsValidation, validate, getMyPosts);



module.exports = router;
