const express = require("express");
const { login, register, deleteUserByEmail, updateUser, searchUsers, exportUserCSV, getUserById, searchUsersSuffix, getCurrentUser } = require("../controller/userController");
const upload = require("../middleware/uploadDiskStorage"); 
const tokenAuthenticator = require('../middleware/tokenAuthenticator')
const {searchLimiter} = require("../middleware/rateLimiter");
const userRouter = express.Router();
const validate = require('../middleware/validate');
const { loginValidation, registerValidation, updateUserValidation, searchUsersValidation } = require('../middleware/validators');

userRouter.post("/login", loginValidation, validate, login);

userRouter.post("/register", upload.single("image"), registerValidation, validate, register);

userRouter.put("/update",tokenAuthenticator, upload.single("image"), updateUserValidation, validate, updateUser);

userRouter.delete("/delete", deleteUserByEmail);

userRouter.post("/search", tokenAuthenticator, searchLimiter, searchUsersValidation, validate, searchUsers);

userRouter.get("/searchSuffix", tokenAuthenticator, searchLimiter, searchUsersSuffix);

userRouter.get("/searchById/:id", tokenAuthenticator, searchLimiter, getUserById);

userRouter.get("/getCurrentuser", tokenAuthenticator, searchLimiter, getCurrentUser);

userRouter.get("/getuserData",tokenAuthenticator, exportUserCSV);

// New: public profile with counters and posts
const { getPublicProfile } = require('../controller/userPublicController');
userRouter.get('/profile/:id', tokenAuthenticator, getPublicProfile);

module.exports = userRouter;
