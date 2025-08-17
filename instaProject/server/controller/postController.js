const { Post, User, Follow } = require("../model");
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
  res.status(201).json({ message: "Post Updated", caption: newPost.caption , id : newPost.id });
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({ where: { id, userId: req.user.id } });
  if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });

  await post.destroy();
  res.json({ message: "Post deleted" });
});

const getFeeds = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = 10; 
  const offset = (page - 1) * limit;

  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
    limit: 100, 
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

module.exports = {createPost, deletePost, updatePost, getFeeds}