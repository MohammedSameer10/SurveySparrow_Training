const asyncHandler = require('express-async-handler');
const { User, Follower, Post, Like, Notification } = require('../model');

exports.getPublicProfile = asyncHandler(async (req, res) => {
  const profileUserId = req.params.id;

  const profile = await User.findByPk(profileUserId, {
    attributes: ['id', 'username', 'image', 'bio']
  });
  if (!profile) return res.status(404).json({ message: 'User not found' });

  const [followersCount, followingCount, posts] = await Promise.all([
    Follower.count({ where: { followingId: profileUserId } }),
    Follower.count({ where: { followerId: profileUserId } }),
    Post.findAll({
      where: { userId: profileUserId },
      include: [{ model: Like, attributes: ['id'] }, { model: User, attributes: ['id', 'username', 'image'] }],
      order: [['createdAt', 'DESC']]
    })
  ]);

  // Record view in notifications
  try {
    const viewerId = req.user.id;
    const viewerName = req.user.username;
    // Self activity for activity feed
    await Notification.create({
      message: `You viewed ${profile.username}'s profile`,
      targetUserId: viewerId,
      senderUserId: viewerId,
    });
    // Notify the profile owner (optional for notifications page)
    await Notification.create({
      message: `${viewerName} viewed your profile`,
      targetUserId: profile.id,
      senderUserId: viewerId,
    });
  } catch (e) {
    // non-blocking
  }

  const formattedPosts = posts.map(p => ({
    id: p.id,
    caption: p.caption,
    imagePath: p.imagePath,
    createdAt: p.createdAt,
    userId: p.userId,
    username: p.User?.username || profile.username,
    profileImage: p.User?.image || profile.image,
    likeCount: p.Likes.length,
    likedByCurrentUser: false,
    isOwnPost: req.user.id === profileUserId,
  }));

  res.json({
    user: {
      id: profile.id,
      username: profile.username,
      image: profile.image,
      bio: profile.bio,
      followers: followersCount,
      following: followingCount,
    },
    posts: formattedPosts,
  });
});
