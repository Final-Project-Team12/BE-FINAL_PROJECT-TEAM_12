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
            if (!customerDetails.email || !customerDetails.mobile_number) {
                return res.status(400).json({
                    message: "Customer email and mobile number are required",
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
            console.error("Payment creation error:", error);

            if (error.message === "USER_NOT_FOUND") {
                return res.status(404).json({
                    message: "User not found with provided email or phone number",
                    status: 404
                });
            }

            if (error.message.includes("already exists")) {
                return res.status(409).json({
                    message: `Payment with orderId ${req.body.orderId} already exists`,
                    status: 409
                });
            }

            if (error.message.includes("Amount must be greater than 0")) {
                return res.status(400).json({
                    message: error.message,
                    status: 400
                });
            }

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
            console.error("Payment cancellation error:", error);

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
            console.error("Payment status retrieval error:", error);

            if (error.message.includes("Payment not found")) {
                return res.status(404).json({
                    message: error.message,
                    status: 404
                });
            }

            return res.status(500).json({
                message: "Failed to retrieve payment status",
                status: 500
            });
        }
    }
}

module.exports = PaymentController;