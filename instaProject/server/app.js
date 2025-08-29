const express = require('express');
require('dotenv').config();
const errorHandler = require('./middleware/errorhandler')
const models = require('./model'); 
const { registerModelHooks } = require('./opensearch/sync');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const likeRouter = require('./routes/likeRoutes');
const followRouter = require('./routes/followRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const cron = require("node-cron");
const path = require("path");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { cleanupNotifications } = require("./controller/notificationController");
const tokenAuthenticator = require('./middleware/tokenAuthenticator');
const { logger, loggerMiddleware } = require('./middleware/logger');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',   
  credentials: true
}));
app.use(cookieParser())
app.use(loggerMiddleware)
app.use(errorHandler)

app.get('/', (req, res) => {
    res.status(200).json({ code: 1, msg: "Hi Sameer" });
});
app.use("/uploads", express.static(path.join(__dirname, "./middleware/uploads")));

app.use("/users", userRouter);
app.use(tokenAuthenticator);
app.use("/post", postRouter);
app.use('/like',likeRouter);
app.use('/follow',followRouter);
app.use('/notification',notificationRouter);


cron.schedule("0 0 * * *", () => {
  logger.info("Running notification cleanup...");
  cleanupNotifications();
});


registerModelHooks(models);

models.sequelize.sync({ alter: true })
    .then(() => {
        logger.info("Database synced successfully");
    })
    .catch(err => {
        logger.error("Error syncing database:", err);
    });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    logger.info(`Server started at port : ${port}`);
});
