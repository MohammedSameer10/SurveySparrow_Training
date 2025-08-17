const express = require("express");
const { login, register, deleteUserByEmail, updateUser } = require("../controller/userController");
const upload = require("../middleware/upload"); 
const tokenAuthenticator = require('../middleware/tokenAuthenticator')
const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", upload.single("profileImage"), register);

userRouter.put("/update",tokenAuthenticator, upload.single("profileImage"), updateUser);

userRouter.delete("/delete", deleteUserByEmail);

module.exports = userRouter;
