const { createPayment, handleNotification, cancelPayment } = require("../services/paymentService");

async function createPaymentController(req, res, next) {
  try {
    const { orderId, amount, customerDetails, productDetails } = req.body;

    if (!orderId || !amount || !customerDetails || !productDetails) {
      return res.status(400).json({
        message: "orderId, amount, customerDetails, and productDetails are required",
        status: 400,
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a valid number greater than 0",
        status: 400,
      });
    }

    if (!Array.isArray(productDetails) || productDetails.length === 0) {
      return res.status(400).json({
        message: "Product details must be a non-empty array",
        status: 400,
      });
    }

    for (const product of productDetails) {
      if (!product.productId || !product.productName || !product.quantity || !product.price) {
        return res.status(400).json({
          message: "Each product must include productId, productName, quantity, and price",
          status: 400,
        });
      }

      if (isNaN(product.quantity) || product.quantity <= 0 || isNaN(product.price) || product.price <= 0) {
        return res.status(400).json({
          message: "Quantity and price must be valid numbers greater than 0",
          status: 400,
        });
      }
    }

    const response = await createPayment(orderId, amount, customerDetails, productDetails);

    return res.status(201).json({
      message: "Payment initiated successfully",
      status: 201,
      snapToken: response.token,
      redirectUrl: response.redirectUrl,
    });
  } catch (error) {
    console.error("[createPaymentController] Error:", error.message);
    return res.status(500).json({
      message: "Failed to initiate payment",
      status: 500,
      error: error.message,
    });
  }
}

async function handleNotificationController(req, res, next) {
  try {
    const notification = req.body;
    if (
      !notification ||
      !notification.order_id ||
      !notification.transaction_status ||
      !notification.transaction_id
    ) {
      return res.status(400).json({
        message: "Invalid notification received",
        status: 400,
      });
    }

    await handleNotification(notification);

    return res.status(200).json({
      message: "Notification handled successfully",
      status: 200,
    });
  } catch (error) {
    console.error("[handleNotificationController] Error:", error.message);
    return res.status(500).json({
      message: "Failed to handle notification",
      status: 500,
      error: error.message,
    });
  }
}

async function cancelPaymentController(req, res) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
        status: 400,
      });
    }

    const response = await cancelPayment(orderId);

    return res.status(200).json({
      message: "Payment canceled successfully",
      status: 200,
      midtransResponse: response,
    });
  } catch (error) {
    console.error("[cancelPaymentController] Error:", error.message);
    return res.status(500).json({
      message: "Failed to cancel payment",
      status: 500,
      error: error.message,
    });
  }
}


module.exports = {
  createPaymentController,
  handleNotificationController,
  cancelPaymentController,
};
