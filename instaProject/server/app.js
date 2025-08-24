const express = require('express');
require('dotenv').config();
const errorHandler = require('./middleware/errorhandler')
const models = require('./model'); 
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

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',   
  credentials: true
}));
app.use(cookieParser())
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
  console.log("Running notification cleanup...");
  cleanupNotifications();
});


models.sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synced successfully");
    })
    .catch(err => {
        console.error("Error syncing database:", err);
    });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started at port : ${port}`);
});
