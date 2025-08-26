const express = require("express");
const router = express.Router();
const { getNotifications, updateNotification, getMyActivity } = require("../controller/notificationController");

router.get("/get", getNotifications);

router.put("/update/:id", updateNotification);

router.get("/activity", getMyActivity);

module.exports = router;
