const router = require("express").Router();
const NotificationController = require("../controllers/notificationController");

router.post("/notifications", NotificationController.createNotification);

module.exports = router;