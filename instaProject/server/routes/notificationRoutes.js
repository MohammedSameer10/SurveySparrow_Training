const express = require("express");
const router = express.Router();
const { getNotifications, updateNotification } = require("../controller/notificationController");

router.get("/get", getNotifications);

router.put("/update/:id", updateNotification);

module.exports = router;
