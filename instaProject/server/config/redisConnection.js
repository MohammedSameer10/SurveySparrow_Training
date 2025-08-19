const Redis = require("ioredis");
const { Queue } = require("bullmq");
const connection = {
  host: "127.0.0.1",  
  port: 6379,
  maxRetriesPerRequest: null,
}
const redis = new Redis(connection);
const followQueue = new Queue("followQueue", {
  connection
});

module.exports = { redis, followQueue };
