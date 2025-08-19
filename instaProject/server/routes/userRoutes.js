const express = require("express");
const { login, register, deleteUserByEmail, updateUser, searchUsers, exportUserCSV } = require("../controller/userController");
const upload = require("../middleware/upload"); 
const tokenAuthenticator = require('../middleware/tokenAuthenticator')
const {searchLimiter} = require("../middleware/rateLimiter");
const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", upload.single("profileImage"), register);

userRouter.put("/update",tokenAuthenticator, upload.single("profileImage"), updateUser);

userRouter.delete("/delete", deleteUserByEmail);

userRouter.get("/search", tokenAuthenticator, searchLimiter, searchUsers);

userRouter.get("/getuserData",tokenAuthenticator, exportUserCSV);




module.exports = userRouter;
