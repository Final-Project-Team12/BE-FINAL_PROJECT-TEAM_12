const { PrismaClient } = require("@prisma/client");
const midtransClient = require("midtrans-client");
const prisma = new PrismaClient();

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const PAYMENT_STATUS = {
    PENDING: "PENDING",
    SETTLEMENT: "SETTLEMENT",
    EXPIRED: "EXPIRED",
    CANCELLED: "CANCELLED",
    FAILURE: "FAILURE",
};

const TRANSACTION_STATUS = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
};

/* istanbul ignore next */
async function checkMidtransStatus(orderId) {
    try {
        const midtransStatus = await snap.transaction.status(orderId);
        return midtransStatus;
    } catch (error) {
        if (error.httpStatusCode === "404") {
            return null;
        }

        if (error.httpStatusCode !== "404") {
            console.error(
                `Midtrans API Error for OrderID ${orderId}: ${error.message}`
            );
        }
        return null;
    }
}

/* istanbul ignore next */
async function updateTransactionStatus(transaction, tx) {
    try {
        if (transaction.status === TRANSACTION_STATUS.PENDING && transaction.token) {
            const midtransStatus = await checkMidtransStatus(transaction.token);

            if (!midtransStatus) return transaction;

            let newStatus = transaction.status;
            let paymentStatus = PAYMENT_STATUS.PENDING;
            let notificationTitle = "";
            let notificationDescription = "";

            switch (midtransStatus.transaction_status) {
                case "settlement":
                case "capture":
                    newStatus = TRANSACTION_STATUS.SUCCESS;
                    paymentStatus = PAYMENT_STATUS.SETTLEMENT;
                    notificationTitle = "Payment Successful";
                    notificationDescription = `Your payment with Order ID ${transaction.token} has been completed successfully.`;
                    break;
                case "expire":
                    newStatus = TRANSACTION_STATUS.FAILED;
                    paymentStatus = PAYMENT_STATUS.EXPIRED;
                    notificationTitle = "Payment Expired";
                    notificationDescription = `Your payment with Order ID ${transaction.token} has expired.`;
                    break;
                case "cancel":
                    newStatus = TRANSACTION_STATUS.CANCELLED;
                    paymentStatus = PAYMENT_STATUS.CANCELLED;
                    notificationTitle = "Payment Cancelled";
                    notificationDescription = `Your payment with Order ID ${transaction.token} has been cancelled.`;
                    break;
                case "deny":
                case "failure":
                    newStatus = TRANSACTION_STATUS.FAILED;
                    paymentStatus = PAYMENT_STATUS.FAILURE;
                    notificationTitle = "Payment Failed";
                    notificationDescription = `Your payment with Order ID ${transaction.token} has failed.`;
                    break;
            }

            if (newStatus !== transaction.status) {
                const updatedTransaction = await tx.transaction.update({
                    where: { transaction_id: transaction.transaction_id },
                    data: {
                        status: newStatus,
                        message: notificationDescription,
                    },
                });

                await tx.payment.update({
                    where: { orderId: transaction.token },
                    data: {
                        status: paymentStatus,
                        transactionId: midtransStatus.transaction_id,
                    },
                });

                await tx.notification.create({
                    data: {
                        title: notificationTitle,
                        description: notificationDescription,
                        notification_date: new Date(),
                        user_id: transaction.user_id,
                        is_read: false,
                    },
                });

                return updatedTransaction;
            }
        }
        return transaction;
    } catch (error) {
        console.error(`[Error updating transaction status]:`, error);
        return transaction;
    }
}

async function getTransactionsByUserId(userId) {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
        });

        /* istanbul ignore next*/
        if (!user) {
            /* istanbul ignore next */
            throw new Error("USER_NOT_FOUND");
        }

        const transactions = await prisma.$transaction(async (tx) => {
            const userTransactions = await tx.transaction.findMany({
                where: { user_id: userId },
                include: {
                    tickets: {
                        include: {
                            passenger: true,
                            seat: true,
                            plane: {
                                include: {
                                    airline: true,
                                    origin_airport: true,
                                    destination_airport: true,
                                },
                            },
                        },
                    },
                    user: true,
                },
                orderBy: {
                    transaction_date: "desc",
                },
            });

            const updatedTransactions = await Promise.all(
                userTransactions.map((transaction) =>
                    updateTransactionStatus(transaction, tx)
                )
            );

            return updatedTransactions;
        });

        return transactions;
    } catch (error) {
        /* istanbul ignore next */
        console.error("[Error in getTransactionsByUserId]:", error);
        /* istanbul ignore next */
        throw error;
    }
}

async function createTransaction(userData, passengerData, seatSelections, planeId) {
    try {
        if (!userData?.user_id) throw new Error("INVALID_USER_DATA");
        if (!Array.isArray(passengerData) || passengerData.length === 0)
            throw new Error("INVALID_PASSENGER_DATA");
        /* istanbul ignore next */
        if (!Array.isArray(seatSelections) || seatSelections.length === 0)
            /* istanbul ignore next */
            throw new Error("INVALID_SEAT_SELECTIONS");
        if (!planeId) throw new Error("INVALID_PLANE_ID");

        return await prisma.$transaction(async (tx) => {
            return await createSingleTransaction(
                tx,
                userData,
                passengerData,
                seatSelections,
                planeId,
                "Single trip"
            );
        }, {
            isolationLevel: "Serializable",
        });
    } catch (error) {
        console.error("[Error in createTransaction]:", error);
        throw error;
    }
}

async function createRoundTripTransaction(
    userData,
    passengerData,
    outboundSeatSelections,
    outboundPlaneId,
    returnSeatSelections,
    returnPlaneId
) {
    try {
        /* istanbul ignore next */
        if (!userData?.user_id) throw new Error("INVALID_USER_DATA");
        if (!Array.isArray(passengerData) || passengerData.length === 0)
            throw new Error("INVALID_PASSENGER_DATA");
        if (!Array.isArray(outboundSeatSelections) || outboundSeatSelections.length === 0 ||
            !Array.isArray(returnSeatSelections) || returnSeatSelections.length === 0)
            throw new Error("INVALID_SEAT_SELECTIONS");
        if (!outboundPlaneId || !returnPlaneId) 
            throw new Error("INVALID_PLANE_ID");

        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(userData.user_id) },
        });

        /* istanbul ignore next */
        if (!user) {
            /* istanbul ignore next */
            throw new Error("USER_NOT_FOUND");
        }

        const [outboundPlane, returnPlane] = await Promise.all([
            prisma.plane.findUnique({
                where: { plane_id: parseInt(outboundPlaneId) },
                include: {
                    origin_airport: true,
                    destination_airport: true,
                },
            }),
            prisma.plane.findUnique({
                where: { plane_id: parseInt(returnPlaneId) },
                include: {
                    origin_airport: true,
                    destination_airport: true,
                },
            })
        ]);

        if (!outboundPlane || !returnPlane) {
            throw new Error("PLANE_NOT_FOUND");
        }

        /* istanbul ignore next */
        if (new Date(returnPlane.departure_date) <= new Date(outboundPlane.departure_date)) {
            /* istanbul ignore next */
            throw new Error("INVALID_RETURN_FLIGHT");
        }

        if (outboundPlane.destination_airport.airport_id !== returnPlane.origin_airport.airport_id) {
            throw new Error("INVALID_RETURN_FLIGHT");
        }

        return await prisma.$transaction(async (tx) => {
            const outboundTransaction = await createSingleTransaction(
                tx,
                userData,
                passengerData,
                outboundSeatSelections,
                outboundPlaneId,
                "Outbound flight"
            );

            /* istanbul ignore next */
            const returnTransaction = await createSingleTransaction(
                tx,
                userData,
                passengerData,
                returnSeatSelections,
                returnPlaneId,
                "Return flight"
            );

            /* istanbul ignore next */
            await tx.notification.create({
                data: {
                    title: "Round Trip Booking Confirmed",
                    description: `Your round trip booking has been confirmed. Outbound flight: ${outboundTransaction.transaction_id}, Return flight: ${returnTransaction.transaction_id}`,
                    notification_date: new Date(),
                    user_id: parseInt(userData.user_id),
                    is_read: false,
                },
            });

            /* istanbul ignore next */
            return {
                outbound: outboundTransaction,
                return: returnTransaction
            };
        }, {
            isolationLevel: "Serializable",
        });

    } catch (error) {
        console.error("[Error in createRoundTripTransaction]:", error);
        throw error;
    }
}

async function createSingleTransaction(
    tx,
    userData,
    passengerData,
    seatSelections,
    planeId,
    transactionType
) {
    const selectedSeats = await Promise.all(
        seatSelections.map(async (selection) => {
            const seat = await tx.seat.findUnique({
                where: { seat_id: parseInt(selection.seat_id) },
            });

            if (!seat) {
                throw new Error("INVALID_SEATS_SELECTED");
            }

            /* istanbul ignore next */
            if (!seat.is_available) {
                throw new Error("SEATS_UNAVAILABLE");
            }
            /* istanbul ignore next */
            return seat;
        })
    );

    /* istanbul ignore next */
    const baseAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    /* istanbul ignore next */
    const tax = Math.round(baseAmount * 0.1);
    /* istanbul ignore next */
    const totalPayment = baseAmount + tax;
    /* istanbul ignore next */
    const currentSeats = await Promise.all(
        seatSelections.map((selection) =>
            tx.seat.findUnique({
                where: { seat_id: parseInt(selection.seat_id) },
            })
        )
    );

    /* istanbul ignore next */
    const unavailableSeats = currentSeats.filter(
        (seat, index) =>
            !seat.is_available || seat.version !== selectedSeats[index].version
    );

    /* istanbul ignore next */
    if (unavailableSeats.length > 0) {
        throw new Error("SEATS_UNAVAILABLE");
    }

    /* istanbul ignore next */
    const transaction = await tx.transaction.create({
        /* istanbul ignore next */
        data: {
            status: TRANSACTION_STATUS.PENDING,
            redirect_url: "",
            transaction_date: new Date(),
            token: Math.random().toString(36).substring(7),
            message: `${transactionType} transaction initiated`,
            total_payment: totalPayment,
            base_amount: baseAmount,
            tax_amount: tax,
            user_id: parseInt(userData.user_id),
        },
    });
    /* istanbul ignore next */
    const passengers = await Promise.all(
        /* istanbul ignore next */
        passengerData.map((passenger) =>
            tx.passenger.create({
                data: {
                    title: passenger.title,
                    full_name: passenger.full_name,
                    family_name: passenger.family_name || null,
                    nationality: passenger.nationality,
                    id_number: passenger.id_number || null,
                    id_issuer: passenger.id_issuer || null,
                    id_expiry: passenger.id_expiry
                        ? new Date(passenger.id_expiry)
                        : null,
                    birth_date: passenger.birth_date
                        ? new Date(passenger.birth_date)
                        : null,
                },
            })
        )
    );
    /* istanbul ignore next */
    await Promise.all(
        /* istanbul ignore next */
        seatSelections.map(async (selection, index) => {
            const updatedSeat = await tx.seat.update({
                where: {
                    seat_id: parseInt(selection.seat_id),
                    version: selectedSeats[index].version,
                },
                data: {
                    is_available: false,
                    version: { increment: 1 },
                },
            });

            return await tx.ticket.create({
                data: {
                    transaction_id: transaction.transaction_id,
                    plane_id: parseInt(planeId),
                    passenger_id: passengers[index].passenger_id,
                    seat_id: parseInt(selection.seat_id),
                },
            });
        })
    );
    /* istanbul ignore next */
    return await tx.transaction.findUnique({
        /* istanbul ignore next */
        where: { transaction_id: transaction.transaction_id },
        include: {
            tickets: {
                include: {
                    passenger: true,
                    seat: true,
                    plane: {
                        include: {
                            airline: true,
                            origin_airport: true,
                            destination_airport: true,
                        },
                    },
                },
            },
            user: true,
        },
    });
}

/* istanbul ignore next */
async function updateTransaction(transactionId, updateData) {
    try {
        const transaction = await prisma.transaction.update({
            where: { transaction_id: transactionId },
            data: updateData,
            include: {
                tickets: {
                    include: {
                        passenger: true,
                        seat: true,
                        plane: {
                            include: {
                                airline: true,
                                origin_airport: true,
                                destination_airport: true,
                            },
                        },
                    },
                },
                user: true,
            },
        });

        return transaction;
    } catch (error) {
        console.error("[Error in updateTransaction]:", error);
        if (error.code === "P2025") {
            throw new Error("TRANSACTION_NOT_FOUND");
        }
        throw error;
    }
}

/* istanbul ignore next */
async function deleteTransaction(transactionId) {
    try {
        await prisma.transaction.delete({
            where: { transaction_id: transactionId },
        });
    } catch (error) {
        console.error("[Error in deleteTransaction]:", error);
        if (error.code === "P2025") {
            throw new Error("TRANSACTION_NOT_FOUND");
        }
        throw error;
    }
}

module.exports = {
    getTransactionsByUserId,
    createTransaction,
    createRoundTripTransaction,
    updateTransaction,
    deleteTransaction,
};