const { Like, Post, Notification, User } = require("../model");
const asyncHandler = require('express-async-handler')

const addLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  const post = await Post.findByPk(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const existingLike = await Like.findOne({ where: { userId: req.user.id, postId } });
  if (existingLike) {
    return res.status(200).json({ message: "Already liked" });
  }

  const like = await Like.create({
    userId: req.user.id,
    postId: postId
  });

  if (post.userId !== req.user.id) {
   const s = await Notification.create({
      message: `${req.user.username} liked your post::postId=${post.id}::imagePath=${post.imagePath || ''}`,
      targetUserId: post.userId,   
      senderUserId: req.user.id     
    });
    console.log(s);
  }

  res.status(201).json({ message: "Post liked successfully", like });
});

const removeLike = async (req, res) => {
  try {
    const { postId } = req.body;

    const like = await Like.findOne({ where: { userId: req.user.id, postId } });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();

    const post = await Post.findByPk(postId);
    if (post && post.userId !== req.user.id) {
      await Notification.destroy({
        where: {
          targetUserId: post.userId,
          senderUserId: req.user.id,
          // match base text only
          message: `${req.user.username} liked your post`
        }
      });
    }

    // self activity for unlike
    try {
      const imagePath = post?.imagePath || '';
      await Notification.create({
        message: `You unliked a post::postId=${postId}::imagePath=${imagePath}`,
        targetUserId: req.user.id,
        senderUserId: req.user.id
      });
    } catch(_){}

    return res.status(200).json({ message: "Like removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;

    const { rows, count } = await Like.findAndCountAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: Post,
          attributes: ["id", "caption", "imagePath", "createdAt", "userId"],
          include: [
            {
              model: User,
              attributes: ["id", "username", "image"]
            },
            {
              model: Like,
              attributes: ["id"]
            }
          ]
        }
      ]
    });

    const formattedLikes = rows.map((like) => {
      const post = like.Post;
      const postUser = post?.User || null;

      return {
        postId: post?.id,
        caption: post?.caption,
        imagePath: post?.imagePath,
        createdAt: post?.createdAt,
        likeCount: Array.isArray(post?.Likes) ? post.Likes.length : 0,
        user: postUser
          ? { id: postUser.id, username: postUser.username, image: postUser.image }
          : { id: null, username: "Unknown", image: null },
        likedByCurrentUser: true,
      };
    });

    const totalPages = Math.ceil(count / limit);
    res.json({
      totalLikes: count,
      totalPages,
      page,
      limit,
      likes: formattedLikes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addLike, removeLike, getUserLikes };
