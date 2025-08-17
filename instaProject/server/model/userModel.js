module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    profileImage: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    }
  });

  User.associate = models => {
    User.hasMany(models.Post, { foreignKey: "userId" });
    User.hasMany(models.Like, { foreignKey: "userId" });
    User.hasMany(models.Follower, { foreignKey: "followerId" });
    User.hasMany(models.Follower, { foreignKey: "followingId" });
    User.hasMany(models.Notification, { foreignKey: "targetUserId", as: "ReceivedNotifications" });
    User.hasMany(models.Notification, { foreignKey: "senderUserId", as: "SentNotifications" });

  };

  return User;
};
