const midtransClient = require("midtrans-client");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SETTLEMENT: 'SETTLEMENT',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
    FAILURE: 'FAILURE'
};

const CANCELLABLE_STATUSES = [PAYMENT_STATUS.PENDING];

function formatDate(date) {
    const pad = (num) => (num < 10 ? '0' + num : num);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const offset = '+0700';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${offset}`;
}

async function createPayment(orderId, amount, customerDetails, productDetails) {
    try {
        const user = await db.users.findUnique({
            where: { email: customerDetails.email }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const existingPayment = await db.payment.findUnique({
            where: { orderId }
        });

        if (existingPayment) {
            throw new Error(`Payment with orderId ${orderId} already exists`);
        }
        
        if (amount <= 0) {
            throw new Error("Payment validation failed: Amount must be greater than 0");
        }

        const startTime = formatDate(new Date());

        const payload = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            customer_details: {
                first_name: customerDetails.name,
                email: customerDetails.email,
                phone: customerDetails.mobile_number,
                address: customerDetails.address
            },
            item_details: productDetails.map(item => ({
                id: item.productId,
                price: item.price,
                quantity: item.quantity,
                name: item.productName
            })),
            expiry: {
                start_time: startTime,
                duration: 430,
                unit: "minute"
            }
        };

        const transaction = await snap.createTransaction(payload);

        const result = await db.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    orderId,
                    status: PAYMENT_STATUS.PENDING,
                    amount,
                    snapToken: transaction.token,
                    customerName: customerDetails.name,
                    customerEmail: customerDetails.email,
                    customerPhone: customerDetails.mobile_number,
                    customerAddress: customerDetails.address
                }
            });
            await tx.notification.create({
                data: {
                    title: "Payment Initiated",
                    description: `Your payment with Order ID ${orderId} has been initiated. Amount: ${amount}. Please complete the payment.`,
                    notificationDate: new Date(),
                    user_id: user.user_id,
                    is_read: false
                }
            });

            return payment;
        });

        return {
            payment: result,
            token: transaction.token,
            redirectUrl: transaction.redirect_url
        };
    } catch (error) {
        console.error("Payment creation failed:", error);
        if (error.code === 'P2002') {
            throw new Error(`Duplicate order ID: ${orderId}`);
        }
        throw error;
    }
}

async function cancelPayment(orderId) {
    try {
        const payment = await db.payment.findUnique({
            where: { orderId },
            select: {
                status: true,
                customerEmail: true
            }
        });

        if (!payment) {
            throw new Error("Payment not found");
        }

        if (!CANCELLABLE_STATUSES.includes(payment.status)) {
            throw new Error(`Cannot cancel payment with status: ${payment.status}`);
        }

        const user = await db.users.findUnique({
            where: { email: payment.customerEmail }
        });

        const result = await db.$transaction(async (tx) => {
            const response = await snap.transaction.cancel(orderId);
            
            const updatedPayment = await tx.payment.update({
                where: { orderId },
                data: { status: PAYMENT_STATUS.CANCELLED }
            });
            if (user) {
                await tx.notification.create({
                    data: {
                        title: "Payment Cancelled",
                        description: `Your payment with Order ID ${orderId} has been cancelled.`,
                        notificationDate: new Date(),
                        user_id: user.user_id,
                        is_read: false
                    }
                });
            }

            return {
                midtransResponse: response,
                payment: updatedPayment
            };
        });

        return result;
    } catch (error) {
        console.error("Payment cancellation failed:", error);
        throw error;
    }
}

async function getPaymentStatus(orderId) {
    try {
        const payment = await db.payment.findUnique({
            where: { orderId }
        });

        if (!payment) {
            throw new Error("Payment not found");
        }

        const user = await db.users.findUnique({
            where: { email: payment.customerEmail }
        });

        const midtransStatus = await snap.transaction.status(orderId);
        let status = payment.status;
        let shouldNotify = false;
        let notificationTitle = "";
        let notificationDescription = "";

        switch (midtransStatus.transaction_status) {
            case "pending":
                status = PAYMENT_STATUS.PENDING;
                shouldNotify = true;
                notificationTitle = "Payment Pending";
                notificationDescription = `Your payment with Order ID ${orderId} is waiting for completion.`;
                break;
            case "settlement":
            case "capture":
                status = PAYMENT_STATUS.SETTLEMENT;
                shouldNotify = true;
                notificationTitle = "Payment Successful";
                notificationDescription = `Your payment with Order ID ${orderId} has been completed successfully.`;
                break;
            case "expire":
                status = PAYMENT_STATUS.EXPIRED;
                shouldNotify = true;
                notificationTitle = "Payment Expired";
                notificationDescription = `Your payment with Order ID ${orderId} has expired.`;
                break;
            case "cancel":
                status = PAYMENT_STATUS.CANCELLED;
                shouldNotify = true;
                notificationTitle = "Payment Cancelled";
                notificationDescription = `Your payment with Order ID ${orderId} has been cancelled.`;
                break;
            case "deny":
            case "failure":
                status = PAYMENT_STATUS.FAILURE;
                shouldNotify = true;
                notificationTitle = "Payment Failed";
                notificationDescription = `Your payment with Order ID ${orderId} has failed. Please try again.`;
                break;
        }

        if (status !== payment.status) {
            await db.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { orderId },
                    data: {
                        status,
                        transactionId: midtransStatus.transaction_id || undefined
                    }
                });

                if (shouldNotify && user) {
                    await tx.notification.create({
                        data: {
                            title: notificationTitle,
                            description: notificationDescription,
                            notificationDate: new Date(),
                            user_id: user.user_id,
                            is_read: false
                        }
                    });
                }
            });
        }

        return {
            payment: {
                ...payment,
                status
            },
            midtransStatus
        };
    } catch (error) {
        console.error("Payment status check failed:", error);
        throw error;
    }
}

module.exports = {
    createPayment,
    cancelPayment,
    getPaymentStatus
};