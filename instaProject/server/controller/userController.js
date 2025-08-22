const asyncHandler = require("express-async-handler");
const {redis} = require("../config/redisConnection");
const bcrypt = require("bcryptjs");
const { User, Post, Follower, Sequelize } = require("../model");
const {Parser} = require('json2csv');
const path = require('path')
const jwt = require("jsonwebtoken");


const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email, and password are required");
  }


  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    res.status(400);
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    profileImage: req.file?.buffer || null
  });

  res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser.id, username: newUser.username, email: newUser.email }
  });
});



function generateTokenAndSetCookie(res, email, id , username) {
  const token = jwt.sign({ email, id, username }, process.env.JWT_SECRET, {
    expiresIn: "1d", 
  });

res.cookie("jwt", token, {
  httpOnly: true,    
  secure: false,    
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000 
});


  return token;
}


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log("No User Found")
    res.status(401);
    throw new Error("email not found in db");
  }

  const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = password === user.password;;
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  const token = generateTokenAndSetCookie(res, email, user.id, user.username);

  res.status(200).json({
    message: "Login successful",
    token, 
    user: { id: user.id, username: user.username, email: user.email }
  });
});



const deleteUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required to delete user");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.destroy();

  res.status(200).json({
    message: "User deleted successfully",
    deletedEmail: email
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const { username, newEmail } = req.body || {};

  if (username) user.username = username;
  if (newEmail) user.email = newEmail;

  if (req.file) {
    user.profileImage = `/uploads/${req.file.filename}`;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage || "Not set",
    },
  });
});

module.exports = { updateUser };


const searchUsers = asyncHandler(async (req, res) => {
  const { searchTerm = "", cursor, limit = 20, page=1 } = req.body;
  const userId = req.user.id;

  const whereClause = { id: { [Sequelize.Op.ne]: userId } };

  if (searchTerm.trim() !== "") {
    whereClause.username = { [Sequelize.Op.iLike]: `%${searchTerm.trim()}%` };
  }

  const { rows: users, count: totalUsers } = await User.findAndCountAll({
    where: whereClause,
    attributes: ["id", "username", "email"],
    order: [["username", "ASC"]],
    limit: parseInt(limit),
    offset:(parseInt(page) - 1) * parseInt(limit),
    raw: true
  });

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});

const searchUsersSuffix = asyncHandler(async (req, res) => {
  const { searchTerm = "", cursor, direction = "next", limit = 20 } = req.body;
  const userId = req.user.id;

  const whereClause = { id: { [Sequelize.Op.ne]: userId } };

  if (searchTerm.trim() !== "") {
    whereClause.username = { [Sequelize.Op.iLike]: `${searchTerm.trim()}%` };
  }

  if (cursor) {
    if (direction === "next") {
      whereClause.username = { ...(whereClause.username || {}), [Sequelize.Op.gt]: cursor };
    } else if (direction === "prev") {
      whereClause.username = { ...(whereClause.username || {}), [Sequelize.Op.lt]: cursor };
    }
  }

  const users = await User.findAll({
    where: whereClause,
    attributes: ["id", "username", "email"],
    order: [["username", direction === "prev" ? "DESC" : "ASC"]],
    limit: parseInt(limit),
    raw: true
  });

  if (direction === "prev") users.reverse();

  res.json({
    limit: parseInt(limit),
    prevCursor: users.length ? users[0].username : null,
    nextCursor: users.length ? users[users.length - 1].username : null,
    users,
  });
});


const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const cacheKey = `user:${id}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("Cache hit for user:", id);
    return res.json(JSON.parse(cached));
  }

  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "profileImage"]
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await redis.setex(cacheKey, 60, JSON.stringify(user));

  res.json(user);
});

const exportUserCSV = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findOne({
    where: { id: userId },
    attributes: ["username", "email"]
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const followings = await Follower.findAll({
    where: { followerId: userId },
    include: [{ model: User, as: "FollowingUser", attributes: ["username", "email"] }],
    raw: true,
    nest: true
  });

  const followingUsers = followings.map(f => f.FollowingUser.username).join(", ");

  const followers = await Follower.findAll({
    where: { followingId: userId },
    include: [{ model: User, as: "FollowerUser", attributes: ["username", "email"] }],
    raw: true,
    nest: true
  });

  const followerUsers = followers.map(f => f.FollowerUser.username).join(", ");

  const posts = await Post.findAll({
    where: { userId },
    attributes: ["id"],
    raw: true
  });

  const postIds = posts.map(p => p.id).join(", ");

  const csvData = [
    {
      username: user.username,
      email: user.email,
      following: followingUsers,
      followers: followerUsers,
      posts: postIds
    }
  ];

  const parser = new Parser();
  const csv = parser.parse(csvData);

  res.header("Content-Type", "text/csv");
  res.attachment(`${user.username}_data.csv`);
  res.send(csv);
});

module.exports = { login, register, deleteUserByEmail, updateUser, searchUsers, exportUserCSV, getUserById, searchUsersSuffix };

