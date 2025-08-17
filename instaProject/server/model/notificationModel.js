module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      foreignKey: "targetUserId",
      as: "targetUser"
    });

    Notification.belongsTo(models.User, {
      foreignKey: "senderUserId",
      as: "senderUser"
    });
  };

  return Notification;
};
