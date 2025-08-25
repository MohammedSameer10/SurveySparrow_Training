const { Follower, User, Notification } = require("../model");
const {followQueue} = require('../config/redisConnection')
const asyncHandler = require("express-async-handler");

const addFollow = asyncHandler(async (req, res) => {
  // const followerId = req.user.id; 
  // const { followingId } = req.body;

  // if (followerId === followingId) {
  //   return res.status(400).json({ message: "You cannot follow yourself" });
  // }

  // const existingFollow = await Follower.findOne({ where: { followerId, followingId } });
  // if (existingFollow) {
  //   return res.status(400).json({ message: "Already following this user" });
  // }

  // const follow = await Follower.create({ followerId, followingId });

  // const followerUser = await User.findByPk(followerId, { attributes: ["username"] });
  // if (followerUser) {
  //   await Notification.create({
  //     message: `${followerUser.username} started following you`,
  //     targetUserId: followingId, 
  //     senderUserId: followerId   
  //   });
  // }
  // res.status(201).json({ message: "Followed successfully", follow });

   const followerId = req.user.id;
  const { followingId } = req.body;

  if (followerId === followingId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  await followQueue.add("addFollow", { followerId, followingId });

  res.status(202).json({ message: "Follow request queued" });
});


const removeFollow = asyncHandler(async (req, res) => {
  const followerId = req.user.id; 
  const { followingId } = req.body;

  const deleted = await Follower.destroy({ where: { followerId, followingId } });
  if (!deleted) {
    return res.status(200).json({ message: "Already not following" });
  }

 
  const followerUser = await User.findByPk(followerId, { attributes: ["username"] });
  if (followerUser) {
    await Notification.destroy({
      where: {
        targetUserId: followingId,
        senderUserId: followerId,
        message: `${followerUser.username} started following you`
      }
    });
  }

  res.json({ message: "Unfollowed successfully" });
});


const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const followers = await Follower.findAll({
    where: { followingId: userId },
    include: [
      { model: User, as: "FollowerUser", attributes: ["id", "username", "bio" , "image"] }
    ]
  });

  res.json(followers);
});


const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const following = await Follower.findAll({
    where: { followerId: userId },
    include: [
      { model: User, as: "FollowingUser", attributes: ["id", "username", "bio", "image" ] }
    ]
  });

  res.json(following);
});

module.exports = { addFollow, removeFollow, getFollowers, getFollowing };
