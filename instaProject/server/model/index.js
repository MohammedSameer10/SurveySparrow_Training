const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnection");

const models = {
  User: require("./userModel")(sequelize, Sequelize.DataTypes),
  Post: require("./postModel")(sequelize, Sequelize.DataTypes),
  Like: require("./likeModel")(sequelize, Sequelize.DataTypes),
  Follower: require("./followModel")(sequelize, Sequelize.DataTypes),
  Notification: require("./notificationModel")(sequelize, Sequelize.DataTypes)
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
