module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  });

  Like.associate = models => {
    Like.belongsTo(models.User, { foreignKey: "userId" });
    Like.belongsTo(models.Post, { foreignKey: "postId" });
  };

  return Like;
};
