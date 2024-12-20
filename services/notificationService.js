const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createNotification(data) {
  return await prisma.notification.create({
    data,
  });
}

async function getAllNotifications() {
  return await prisma.notification.findMany({
    include: { user: true },
  });
}

async function getNotificationById(notification_id) {
  return await prisma.notification.findUnique({
    where: { notification_id: parseInt(notification_id) },
  });
}

async function deleteNotification(notification_id) {
  return await prisma.notification.delete({
    where: { notification_id: parseInt(notification_id) },
  });
}

async function markNotificationAsRead(notification_id) {
  return await prisma.notification.update({
    where: { notification_id: parseInt(notification_id) },
    data: { is_read: true },
  });
}

async function getNotificationByUserId(user_id) {
  return await prisma.notification.findMany({
    where: { user_id: parseInt(user_id) },
  });
}

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  deleteNotification,
  markNotificationAsRead,
  getNotificationByUserId,
};