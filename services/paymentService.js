const midtransClient = require("midtrans-client");
const prisma = require("@prisma/client");
const axios = require("axios");
const { PrismaClient } = prisma;
const db = new PrismaClient();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

async function createPayment(orderId, amount) {
  try {
    const payload = {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bca",
      },
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
    };

    console.log("Payload yang dikirim ke Midtrans:", payload);

    const response = await axios.post(
      "https://api.sandbox.midtrans.com/v2/charge",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            process.env.MIDTRANS_SERVER_KEY + ":"
          ).toString("base64")}`,
        },
      }
    );

    // console.log('Response dari Midtrans:', response.data);

    return response.data;
  } catch (error) {
    console.error(
      "[Error in createPayment]:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create payment with Midtrans");
  }
}

async function handleNotification(notification) {
  try {
    console.log("[Notification Received]:", notification);
  } catch (error) {
    console.error("[Error in handleNotification]:", error.message);
    throw new Error("Failed to handle notification");
  }
}

async function handleNotification(notification) {
  const { order_id, transaction_status, transaction_id } = notification;

  await db.payment.update({
    where: { orderId: order_id },
    data: {
      status: transaction_status,
      transactionId: transaction_id,
    },
  });
}

module.exports = {
  createPayment,
  handleNotification,
};
