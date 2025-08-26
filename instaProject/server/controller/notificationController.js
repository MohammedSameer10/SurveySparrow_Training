const { Notification, User, Post, Like, Follower, Sequelize } = require("../model");
const asyncHandler = require("express-async-handler");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: {
      targetUserId: req.user.id,
      isRead: false,
      // Exclude self-generated notifications
      senderUserId: { [Sequelize.Op.ne]: req.user.id }
    },
    include: [
      { model: User, as: "senderUser", attributes: ["id", "username", "email"] }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.status(200).json(notifications);
});

const updateNotification = asyncHandler(async (req, res) => {
  const { id } = req.params; 

  const notification = await Notification.findOne({
    where: { id, targetUserId: req.user.id } 
  });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ message: "Notification marked as read" });
});

const cleanupNotifications = asyncHandler(async () => {
  const { Op } = require("sequelize");

  await Notification.destroy({
    where: {
      isRead: true,
      createdAt: {
        [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });
});

module.exports = { getNotifications, updateNotification, cleanupNotifications };

// Build user's own activity feed (posts created, likes made, follows made)
const getMyActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

  // Pull a window from each source then merge/sort; widen window to improve mix
  const windowSize = limit * 3;

  const [me, posts, likes, follows] = await Promise.all([
    User.findByPk(userId, { attributes: ["id", "username", "image"] }),
    Post.findAll({ where: { userId }, order: [["createdAt", "DESC"]], limit: windowSize, attributes: ["id", "caption", "imagePath", "createdAt"] }),
    Like.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: windowSize,
      attributes: ["postId", "createdAt"],
      include: [{
        model: Post,
        attributes: ["id", "caption", "imagePath"],
        include: [{ model: User, attributes: ["id", "username", "image"] }]
      }]
    }),
    Follower.findAll({ where: { followerId: userId }, order: [["createdAt", "DESC"]], limit: windowSize, attributes: ["followingId", "createdAt"], include: [{ model: User, as: "FollowingUser", attributes: ["id", "username", "image"] }] })
  ]);

  const items = [];
  posts.forEach(p => items.push({ type: "post", createdAt: p.createdAt, data: { postId: p.id, caption: p.caption, imagePath: p.imagePath, owner: me ? { id: me.id, username: me.username, image: me.image } : null } }));
  likes.forEach(l => items.push({ type: "like", createdAt: l.createdAt, data: { postId: l.postId, caption: l.Post?.caption, imagePath: l.Post?.imagePath, owner: l.Post?.User ? { id: l.Post.User.id, username: l.Post.User.username, image: l.Post.User.image } : null } }));
  follows.forEach(f => items.push({ type: "follow", createdAt: f.createdAt, data: { userId: f.FollowingUser?.id, username: f.FollowingUser?.username, image: f.FollowingUser?.image } }));

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  const totalPages = Math.ceil(total / limit) || 1;
  res.json({ items: paged, page, limit, total, totalPages, hasMore: page < totalPages });
});

module.exports.getMyActivity = getMyActivity;
