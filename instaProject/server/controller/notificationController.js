const { Notification, User } = require("../model");
const asyncHandler = require("express-async-handler");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { targetUserId: req.user.id ,  isRead: false}, 
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
      createdAt: {
        [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });
});

module.exports = { getNotifications, updateNotification, cleanupNotifications };
