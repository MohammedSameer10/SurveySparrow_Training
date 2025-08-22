module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    imagePath: {
    type: DataTypes.STRING, 
    allowNull: true
    }
  });

  Post.associate = models => {
    Post.belongsTo(models.User, { foreignKey: "userId" });
    Post.hasMany(models.Like, { foreignKey: "postId" });
  };

  return Post;
};
