const { Post, Follower , User, Like, Sequelize} = require("../model");
const asyncHandler = require("express-async-handler");
const createPost = asyncHandler(async (req, res) => {
  const caption = req.body.caption?.trim() || null;

  if (!caption && !req.file) {
    return res.status(400).json({ message: "Either caption or image is required" });
  }

  const newPost = await Post.create({
    caption,
    imagePath: req.file ? `/uploads/${req.file.filename}` : null, 
    userId: req.user.id,
  });

  res.status(201).json({
    message: "Post created",
    id: newPost.id,
    caption: newPost.caption,
    image: newPost.imagePath,
  });
});



const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;

  const post = await Post.findOne({ where: { id, userId: req.user.id } });
  if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });

  post.caption = caption || post.caption;
  if (req.file) post.imagePath =  req.file ? `/uploads/${req.file.filename}` : null ;

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
  const limit = 20; 
  const offset = (page - 1) * limit;

  const currentUserId = req.user.id;  

  // Get the users the current user is following
  const following = await Follower.findAll({
    where: { followerId: currentUserId },
    attributes: ["followingId"]
  });

  const followingIds = following.map(f => f.followingId);
  followingIds.push(currentUserId); // include self posts

  // Count total posts for pagination
  const total = await Post.count({ where: { userId: followingIds } });

  // Fetch posts including user info and likes with proper pagination
  const posts = await Post.findAll({
    where: { userId: followingIds },
    include: [
      {
        model: User, 
        attributes: ["id", "username", "image"]
      },
      {
        model: Like, // include likes
        attributes: ["id", "userId"]
      }
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  // Flatten posts and include likeCount
  const flattened = posts.map(post => ({
    id: post.id,
    caption: post.caption,
    image: post.image,
    imagePath: post.imagePath,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    userId: post.userId,
    username: post.User?.username || "Unknown",
    profileImage: post.User?.image || null,
    likeCount: post.Likes.length,
    likedByCurrentUser: post.Likes.some(like => like.userId === currentUserId)
  }));

  res.status(200).json({
    page,
    postLength: flattened.length,
    posts: flattened,
    hasMore: offset + flattened.length < total
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
    include: [{ model: User, attributes: ["id", "username", "image"] }],
    order: [["createdAt", sortOrder]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  res.json({postLength:posts.length, posts });
});
const searchMyPost = asyncHandler(async (req, res) => {
  const { searchTerm = "", page = 1, limit = 20, sortOrder = "DESC" } = req.body;
  const userId = req.user.id;
  const offset = (page - 1) * limit;

  const whereClause = {
    userId,
    caption: { [Sequelize.Op.like]: `%${searchTerm}%` },
  };

  const posts = await Post.findAll({
    where: whereClause,
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "Likes" AS l
            WHERE l."postId" = "Post"."id"
          )`),
          "likeCount",
        ],
      ],
    },
    order: [["createdAt", sortOrder]],
    offset: parseInt(offset),
    limit: parseInt(limit),
  });

  const totalPosts = await Post.count({ where: whereClause });

  res.json({
    page: parseInt(page),
    total: totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    posts,
  });
});





const getMyPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const offset = (page - 1) * limit;

  const posts = await Post.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "Likes" AS l
            WHERE l."postId" = "Post"."id"
          )`),
          "likeCount"
        ]
      ]
    }
  });

  const totalPosts = await Post.count({ where: { userId } });

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    posts
  });
});



module.exports = {createPost, deletePost, updatePost, getFeeds, searchPosts, searchMyPost , getMyPosts}