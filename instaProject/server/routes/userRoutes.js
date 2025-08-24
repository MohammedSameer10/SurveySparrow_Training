const express = require("express");
const { login, register, deleteUserByEmail, updateUser, searchUsers, exportUserCSV, getUserById, searchUsersSuffix, getCurrentUser } = require("../controller/userController");
const upload = require("../middleware/uploadDiskStorage"); 
const tokenAuthenticator = require('../middleware/tokenAuthenticator')
const {searchLimiter} = require("../middleware/rateLimiter");
const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", upload.single("image"), register);

userRouter.put("/update",tokenAuthenticator, upload.single("image"), updateUser);

userRouter.delete("/delete", deleteUserByEmail);

userRouter.post("/search", tokenAuthenticator, searchLimiter, searchUsers);

userRouter.get("/searchSuffix", tokenAuthenticator, searchLimiter, searchUsersSuffix);

userRouter.get("/searchById/:id", tokenAuthenticator, searchLimiter, getUserById);

userRouter.get("/getCurrentuser", tokenAuthenticator, searchLimiter, getCurrentUser);

userRouter.get("/getuserData",tokenAuthenticator, exportUserCSV);




module.exports = userRouter;
