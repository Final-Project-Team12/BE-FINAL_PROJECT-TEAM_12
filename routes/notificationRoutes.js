const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notificationController");

const restrictJwt = require("../middlewares/restrictJwt");
const restrictJwtAdmin = require("../middlewares/restrictJwtAdmin");
const restrictedRoutesUser = express.Router();

restrictedRoutesUser.get("", NotificationController.getAllNotifications);
restrictedRoutesUser.get("/:notification_id",NotificationController.getNotificationById);
restrictedRoutesUser.get("/user/:user_id",NotificationController.getNotificationByUserId);
restrictedRoutesUser.put("/:notification_id/read",NotificationController.markNotificationAsRead);

router.use("/notifications", restrictJwt, restrictedRoutesUser);

const restrictedRoutesAdmin = express.Router();

restrictedRoutesAdmin.delete("/:notification_id",NotificationController.deleteNotification);
restrictedRoutesAdmin.post("",NotificationController.createNotification);


router.use("/notifications", restrictJwtAdmin, restrictedRoutesAdmin);

module.exports = router;
