module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define("Follower", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  });

  Follower.associate = models => {
    Follower.belongsTo(models.User, { as: "FollowerUser", foreignKey: "followerId" });
    Follower.belongsTo(models.User, { as: "FollowingUser", foreignKey: "followingId" });
  };

  return Follower;
};

//  const Follower = sequelize.define("Follower", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true
//   },
//   followerId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: "Users", 
//       key: "id"
//     }
//   },
//   followingId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: "Users",
//       key: "id"
//     }
//   }
// }, {
//   indexes: [
//     { unique: true, fields: ["followerId", "followingId"] }, 
//     { fields: ["followerId"] }, 
//     { fields: ["followingId"] }  
//   ]
// });



