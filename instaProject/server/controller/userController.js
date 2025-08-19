const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, Post, Follower, Sequelize } = require("../model");
const {Parser} = require('json2csv')

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
    profileImage: req.file ? req.file.buffer : null
  });

  res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser.id, username: newUser.username, email: newUser.email }
  });
});


const jwt = require("jsonwebtoken");

function generateTokenAndSetCookie(res, email) {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
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
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateTokenAndSetCookie(res, email);

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
    user.profileImage = req.file.buffer;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage ? "Uploaded" : "Not set"
    }
  });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { searchTerm = "", page = 1, limit = 20 } = req.body; 
  const userId = req.user.id;

  const whereClause = {
    id: { [Sequelize.Op.ne]: userId } 
  };

  if (searchTerm.trim() !== "") {
    whereClause.username = { [Sequelize.Op.iLike]: `%${searchTerm.trim()}%` };
  }

  const users = await User.findAll({
    where: whereClause,
    attributes: ["id", "username", "email", "profileImage"],
    order: [["username", "ASC"]],
    offset: (page - 1) * limit,
    limit: parseInt(limit)
  });

  const totalUsers = await User.count({ where: whereClause });

  res.json({
    page: parseInt(page),
    total: totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    users
  });
});

const exportUserCSV = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findOne({
    where: { id: userId },
    attributes: ["username", "email", "password"]
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

module.exports = { login, register, deleteUserByEmail, updateUser, searchUsers, exportUserCSV };

