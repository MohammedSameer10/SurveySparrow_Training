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
      message: `${req.user.username} liked your post`,
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
          message: `${req.user.username} liked your post`
        }
      });
    }

    return res.status(200).json({ message: "Like removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const likes = await Like.findAll({
      where: { userId },
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

    const formattedLikes = likes.map(like => {
      const post = like.Post;
      return {
        postId: post.id,
        caption: post.caption,
        imagePath: post.imagePath,
        createdAt: post.createdAt,
        likeCount: post.Likes.length,
        user: {
          id: post.User.id,
          username: post.User.username,
          image: post.User.image
        },
        likedByCurrentUser: post.userId === parseInt(userId)
      };
    });

    res.json({ totalLikes: formattedLikes.length, likes: formattedLikes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addLike, removeLike, getUserLikes };
