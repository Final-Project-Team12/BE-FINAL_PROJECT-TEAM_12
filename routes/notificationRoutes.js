const router = require("express").Router();
const NotificationController = require("../controllers/notificationController");

router.post("/notifications", NotificationController.createNotification);
router.get("/notifications", NotificationController.getAllNotifications);
router.get("/notifications/:notification_id", NotificationController.getNotificationById);
router.delete("/notifications/:notification_id", NotificationController.deleteNotification);
router.put("/notifications/:notification_id/read", NotificationController.markNotificationAsRead);

module.exports = router;