const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class NotificationController {

  static async createNotification(req, res, next) {
    const { title, description, user_id } = req.body;
    try {
      const notification = await prisma.notification.create({
        data: { title, description, user_id: parseInt(user_id) },
      });
      res.status(201).json({
        status: "success",
        message: "Notification created successfully",
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllNotifications(req, res, next) {
    try {
      const notifications = await prisma.notification.findMany({
        include: { user: true },
      });
      res.status(200).json({
        status: "success",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }


}

module.exports = NotificationController;