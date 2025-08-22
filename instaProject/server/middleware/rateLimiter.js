const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,      
 keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),       
  message: { error: "Too many requests, please try again later." }
});


const followLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
  message: "Too many follow requests, please try again later."
});
module.exports = {searchLimiter,followLimiter};
