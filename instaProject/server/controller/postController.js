const { Post, Follower , User, Sequelize} = require("../model");
const asyncHandler = require("express-async-handler");
const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  if (!req.file) return res.status(400).json({ message: "Image is required" });

  const newPost = await Post.create({
    caption,
    image: req.file.buffer,
    userId: req.user.id
  });

  res.status(201).json({ message: "Post created", caption: newPost.caption , id : newPost.id });
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;

  const post = await Post.findOne({ where: { id, userId: req.user.id } });
  if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });

  post.caption = caption || post.caption;
  if (req.file) post.image = req.file.buffer;

  await post.save();
  res.status(201).json({ message: "Post Updated", caption: post.caption , id : post.id });
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({ where: { id, userId: req.user.id } });
  if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });

  await post.destroy();
  res.json({ message: "Post deleted" });
});


const getFeeds = asyncHandler(async (req, res) => {
  const page = parseInt(req.body?.page) || 1; 
  const limit = 10; 
  const offset = (page - 1) * limit;

  const currentUserId = req.user.id;  

  const following = await Follower.findAll({
    where: { followerId: currentUserId },
    attributes: ["followingId"]
  });

  const followingIds = following.map(f => f.followingId);

  followingIds.push(currentUserId);

  const posts = await Post.findAll({
    where: { userId: followingIds },
    order: [["createdAt", "DESC"]],
    limit: 100
  });

  const shuffled = posts.sort(() => 0.5 - Math.random());
  const paginated = shuffled.slice(offset, offset + limit);

  res.status(200).json({
    page,
    postLength: paginated.length,
    posts: paginated,
    hasMore: offset + limit < shuffled.length
  });
});

const searchPosts = asyncHandler(async (req, res) => {
  const {
    searchTerm = "",
    filterBy = "caption", 
    sortOrder = "DESC",
    page = 1,
    limit = 20
  } = req.body;

  const userId = req.user.id;

  const followings = await Follower.findAll({
    where: { followerId: userId },
    attributes: ["followingId"],
  });
  const allowedUserIds = [userId, ...followings.map(f => f.followingId)];

  let targetUserIds = allowedUserIds;

  if (filterBy === "username" && searchTerm) {
    const matchedUsers = await User.findAll({
      where: {
        id: allowedUserIds,
        username: { [Sequelize.Op.iLike]: `%${searchTerm}%` }
      },
      attributes: ["id"],
      raw: true
    });

    targetUserIds = matchedUsers.map(u => u.id);
    if (targetUserIds.length === 0) return res.json({ posts: [] });
  }

  const whereClause = { userId: targetUserIds };
  if (filterBy === "caption" && searchTerm) {
    whereClause.caption = { [Sequelize.Op.iLike]: `%${searchTerm}%` };
  }

  const posts = await Post.findAll({
    where: whereClause,
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["createdAt", sortOrder]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  res.json({postLength:posts.length, posts });
});

const searchMyPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { searchTerm = "", page = 1, limit = 20, sortOrder = "DESC" } = req.body;

  const offset = (page - 1) * limit;

  let whereClause = { userId };

  if (searchTerm === "image") {
    whereClause.image = { [Sequelize.Op.ne]: null };
  } else if (searchTerm === "caption") {
    whereClause.caption = { [Sequelize.Op.ne]: null };
  }

  let attributes = ["id", "createdAt"];
  if (searchTerm === "image") attributes.push("image");
  else if (searchTerm === "caption") attributes.push("caption");
  else attributes.push("caption", "image");

  const posts = await Post.findAll({
    where: whereClause,
    attributes,
    order: [["createdAt", sortOrder]],
    offset: parseInt(offset),
    limit: parseInt(limit)
  });

  const totalPosts = await Post.count({ where: whereClause });

  res.json({
    page: parseInt(page),
    total: totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    posts
  });
});

module.exports = {createPost, deletePost, updatePost, getFeeds, searchPosts, searchMyPost}