const { Worker } = require("bullmq");
require("dotenv").config();
const { redis } = require("./config/redisConnection");
const {User, Follower, Notification} = require('./model')
const models = require('./model'); 


const followWorker = new Worker(
  "followQueue",
  async (job) => {
    const { followerId, followingId } = job.data;

    const existingFollow = await Follower.findOne({ where: { followerId, followingId } });
    if (existingFollow) {
      return { message: "Already following" };
    }

    const follow = await Follower.create({ followerId, followingId });

    const followerUser = await User.findByPk(followerId, { attributes: ["username"] });

    if (followerUser) {
      await Notification.create({
        message: `${followerUser.username} started following you`,
        targetUserId: followingId,
        senderUserId: followerId,
      });
    }

    return { message: "Follow processed", follow };
  },
  { connection: redis }
);

followWorker.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

followWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

models.sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synced successfully");
    })
    .catch(err => {
        console.error("Error syncing database:", err);
    });