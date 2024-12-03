const midtransClient = require("midtrans-client");
const prisma = require("@prisma/client");
const moment = require("moment");
const { PrismaClient } = prisma;
const db = new PrismaClient();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function createPayment(orderId, amount, customerDetails, productDetails) {
  try {
    const startTime = moment().format("YYYY-MM-DD HH:mm:ss Z");
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.mobile_number,
        address: customerDetails.address,
      },
      item_details: productDetails.map((item) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.productName,
      })),
      expiry: {
        start_time: startTime,
        unit: "minutes",
        duration: 10, // Transaksi akan kedaluwarsa setelah 10 menit
      },
    };

    const transaction = await snap.createTransaction(payload);

    await db.payment.create({
      data: {
        orderId,
        status: "PENDING",
        amount,
        snapToken: transaction.token,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.mobile_number,
        customerAddress: customerDetails.address,
      },
    });

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  } catch (error) {
    console.error("[Error in createPayment]:", error.response?.data || error.message);
    throw new Error("Failed to create payment with Midtrans");
  }
}

async function handleNotification(notification) {
  const { order_id: orderId, transaction_status: status } = notification;

  const payment = await db.payment.findUnique({ where: { orderId } });
  if (!payment) {
    throw new Error("Payment not found");
  }

  let updatedStatus;
  if (status === "settlement") {
    updatedStatus = "SETTLEMENT";
  } else if (status === "cancel" || status === "expire") {
    updatedStatus = "CANCELLED";
  } else if (status === "pending") {
    updatedStatus = "PENDING";
  }

  await db.payment.update({
    where: { orderId },
    data: { status: updatedStatus },
  });
}

async function cancelPayment(orderId) {
  try {
    const payment = await db.payment.findUnique({ where: { orderId } });
    if (!payment || payment.status !== "PENDING") {
      throw new Error("Payment cannot be canceled");
    }

    const response = await snap.transaction.cancel(orderId);
    console.log("[cancelPayment] Transaction canceled on Midtrans:", response);

    await db.payment.update({
      where: { orderId },
      data: { status: "CANCELLED" },
    });

    return response;
  } catch (error) {
    console.error("[cancelPayment] Error:", error.response?.data || error.message);
    throw new Error("Failed to cancel payment");
  }
}

module.exports = {
  createPayment,
  handleNotification,
  cancelPayment,
};