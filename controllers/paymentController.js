const PaymentService = require('../services/paymentService');

class PaymentController {
    static async createPaymentController(req, res) {
        try {
            const { orderId, amount, customerDetails, productDetails } = req.body;
            if (!orderId || !amount || !customerDetails || !productDetails) {
                return res.status(400).json({
                    message: "Missing required fields",
                    status: 400
                });
            }

            const response = await PaymentService.createPayment(
                orderId, 
                amount, 
                customerDetails, 
                productDetails
            );

            return res.status(201).json({
                message: "Payment initiated successfully",
                status: 201,
                data: response
            });

        } catch (error) {
            if (error.code === 'P2002' || error.message.includes("already exists")) {
                return res.status(409).json({
                    message: `Payment with orderId ${req.body.orderId} already exists`,
                    status: 409
                });
            }

            console.error("Payment creation error:", error);
            return res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    static async cancelPaymentController(req, res) {
        try {
            const { orderId } = req.params;
            
            if (!orderId) {
                return res.status(400).json({
                    message: "Order ID is required",
                    status: 400
                });
            }

            const response = await PaymentService.cancelPayment(orderId);

            return res.status(200).json({
                message: "Payment cancelled successfully",
                status: 200,
                data: response
            });
        } catch (error) {
            if (error.message.includes("Payment not found")) {
                return res.status(404).json({
                    message: error.message,
                    status: 404
                });
            }

            if (error.message.includes("Cannot cancel payment")) {
                return res.status(400).json({
                    message: error.message,
                    status: 400
                });
            }

            console.error("Payment cancellation error:", error);
            return res.status(500).json({
                message: "Failed to cancel payment",
                status: 500
            });
        }
    }

    static async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;
            
            if (!orderId) {
                return res.status(400).json({
                    message: "Order ID is required",
                    status: 400
                });
            }

            const payment = await PaymentService.getPaymentStatus(orderId);

            return res.status(200).json({
                message: "Payment status retrieved successfully",
                status: 200,
                data: payment
            });
        } catch (error) {
            if (error.message.includes("Payment not found")) {
                return res.status(404).json({
                    message: error.message,
                    status: 404
                });
            }

            console.error("Payment status retrieval error:", error);
            return res.status(500).json({
                message: "Failed to retrieve payment status",
                status: 500
            });
        }
    }
}

module.exports = PaymentController;