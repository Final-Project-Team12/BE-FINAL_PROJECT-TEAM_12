const midtransClient = require("midtrans-client");
const prisma = require("@prisma/client");
const { PrismaClient } = prisma;
const db = new PrismaClient();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function createPayment(orderId, amount, customerDetails, productDetails) {
  try {
    if (!orderId || !amount || amount <= 0) {
      throw new Error("Invalid orderId or amount");
    }

    if (!customerDetails || !productDetails) {
      throw new Error("Customer details and product details are required");
    }
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
    };

    console.log("[createPayment] Payload sent to Midtrans:", payload);
    const transaction = await snap.createTransaction(payload);

    console.log("[createPayment] Transaction created:", transaction);
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

module.exports = {
  createPayment,
};
