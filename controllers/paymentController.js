const { createPayment, handleNotification } = require('../services/paymentService');
async function createPaymentController(req, res, next) {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ 
        message: 'orderId and amount are required', 
        status: 'error' 
      });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be a valid number greater than 0', 
        status: 'error' 
      });
    }
    
    const redirectUrl = await createPayment(orderId, amount);
    
    return res.status(201).json({
      message: 'Payment initiated successfully',
      redirectUrl: redirectUrl,
      status: 'success'
    });
  } catch (error) {
    console.error('Error creating payment:', error.message);
    return res.status(500).json({
      message: 'Failed to initiate payment',
      error: error.message,
      status: 'error'
    });
  }
}

async function handleNotificationController(req, res, next) {
  try {
    const notification = req.body;

    if (!notification || !notification.order_id || !notification.transaction_status) {
      return res.status(400).json({
        message: 'Invalid notification received',
        status: 'error'
      });
    }

    await handleNotification(notification);

    return res.status(200).json({
      message: 'Notification handled successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Error handling notification:', error.message);
    
    return res.status(500).json({
      message: 'Failed to handle notification',
      error: error.message,
      status: 'error'
    });
  }
}

module.exports = {
  createPaymentController,
  handleNotificationController,
};
