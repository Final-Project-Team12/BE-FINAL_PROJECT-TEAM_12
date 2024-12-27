const moment = require("moment-timezone");
const NotificationService = require("../services/notificationService");

class NotificationController {
  static async createNotification(req, res, next) {
    const { title, description, user_id } = req.body;

    try {
      if (!title || !description || !user_id) {
        return res.status(400).json({
          status: "bad request",
          message: "Title, description, and user_id are required",
        });
      }

      const notification_date = moment().tz("Asia/Jakarta").toISOString();

      const notification = await NotificationService.createNotification({
        title,
        description,
        user_id: parseInt(user_id),
        notification_date,
      });

      res.status(201).json({
        status: "success",
        message: "Notification created successfully",
        data: notification,
      });
      /* istanbul ignore next */
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async getAllNotifications(req, res, next) {
    try {
      const notifications = await NotificationService.getAllNotifications();

      res.status(200).json({
        status: "success",
        data: notifications,
      });
    /* istanbul ignore next */
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async getNotificationById(req, res, next) {
    const { notification_id } = req.params;
    try {
      const notification = await NotificationService.getNotificationById(
        notification_id
      );
      if (!notification) {
        return res.status(404).json({
          status: "not found",
          message: "Notification not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: notification,
      });
      /* istanbul ignore next */
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async deleteNotification(req, res, next) {
    const { notification_id } = req.params;
    try {
      const notification = await NotificationService.getNotificationById(
        notification_id
      );
      if (!notification) {
        return res.status(404).json({
          status: "not found",
          message: "Notification not found",
        });
      }

      await NotificationService.deleteNotification(notification_id);
      res.status(200).json({
        status: "success",
        message: "Notification deleted successfully",
      });
    /* istanbul ignore next */
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async markNotificationAsRead(req, res, next) {
    const { notification_id } = req.params;
    try {
      const notification = await NotificationService.getNotificationById(
        notification_id
      );
      if (!notification) {
        return res.status(404).json({
          status: "not found",
          message: "Notification not found",
        });
      }

      const updatedNotification =
        await NotificationService.markNotificationAsRead(notification_id);
      res.status(200).json({
        status: "success",
        message: "Notification marked as read",
        data: updatedNotification,
      });
      /* istanbul ignore next */
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async getNotificationByUserId(req, res, next) {
    const { user_id } = req.params;
    try {
      const notifications = await NotificationService.getNotificationByUserId(
        user_id
      );
      if (!notifications.length) {
        return res.status(404).json({
          status: "not found",
          message: "No notifications found for the specified user",
        });
      }

      res.status(200).json({
        status: "success",
        data: notifications,
      });
      /* istanbul ignore next */
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }
}

module.exports = NotificationController;