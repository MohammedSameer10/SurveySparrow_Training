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
    bio:{
       type: DataTypes.STRING,
       allowNull: true,
       unique: false
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
    },
    image:{
      type: DataTypes.STRING,
      allowNull:true
    }
  });

  User.associate = models => {
    User.hasMany(models.Post, { foreignKey: "userId", onDelete: "CASCADE"  });
    User.hasMany(models.Like, { foreignKey: "userId", onDelete: "CASCADE"  });
    User.hasMany(models.Follower, { foreignKey: "followerId" ,onDelete: "CASCADE" });
    User.hasMany(models.Follower, { foreignKey: "followingId" , onDelete: "CASCADE" });
    User.hasMany(models.Notification, { foreignKey: "targetUserId", as: "ReceivedNotifications" ,onDelete: "CASCADE" });
    User.hasMany(models.Notification, { foreignKey: "senderUserId", as: "SentNotifications", onDelete: "CASCADE"  });

  };

  return User;
};
