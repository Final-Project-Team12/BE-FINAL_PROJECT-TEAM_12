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

async function updateTransactionStatus(transaction, tx) {
  try {
    if (
      transaction.status === TRANSACTION_STATUS.PENDING &&
      transaction.token
    ) {
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

    if (!user) {
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
    console.error("[Error in getTransactionsByUserId]:", error);
    throw error;
  }
}

async function createTransaction(
  userData,
  passengerData,
  seatSelections,
  planeId
) {
  try {
    if (!userData?.user_id) throw new Error("INVALID_USER_DATA");
    if (!Array.isArray(passengerData) || passengerData.length === 0)
      throw new Error("INVALID_PASSENGER_DATA");
    if (!Array.isArray(seatSelections) || seatSelections.length === 0)
      throw new Error("INVALID_SEAT_SELECTIONS");
    if (!planeId) throw new Error("INVALID_PLANE_ID");

    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userData.user_id) },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const plane = await prisma.plane.findUnique({
      where: { plane_id: parseInt(planeId) },
    });

    if (!plane) {
      throw new Error("PLANE_NOT_FOUND");
    }

    const selectedSeats = await Promise.all(
      seatSelections.map(async (selection) => {
        const seat = await prisma.seat.findUnique({
          where: { seat_id: parseInt(selection.seat_id) },
        });

        if (!seat) {
          throw new Error("INVALID_SEATS_SELECTED");
        }

        if (!seat.is_available) {
          throw new Error("SEATS_UNAVAILABLE");
        }

        return seat;
      })
    );

    const baseAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const tax = Math.round(baseAmount * 0.1);
    const totalPayment = baseAmount + tax;

    return await prisma.$transaction(
      async (tx) => {
        const currentSeats = await Promise.all(
          seatSelections.map((selection) =>
            tx.seat.findUnique({
              where: { seat_id: parseInt(selection.seat_id) },
            })
          )
        );

        const unavailableSeats = currentSeats.filter(
          (seat, index) =>
            !seat.is_available || seat.version !== selectedSeats[index].version
        );

        if (unavailableSeats.length > 0) {
          throw new Error("SEATS_UNAVAILABLE");
        }

        const transaction = await tx.transaction.create({
          data: {
            status: TRANSACTION_STATUS.PENDING,
            redirect_url: "",
            transaction_date: new Date(),
            token: Math.random().toString(36).substring(7),
            message: "Transaction initiated",
            total_payment: totalPayment,
            base_amount: baseAmount,
            tax_amount: tax,
            user_id: parseInt(userData.user_id),
          },
        });

        const passengers = await Promise.all(
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

        const tickets = await Promise.all(
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

        await tx.notification.create({
          data: {
            title: "New Transaction Created",
            description: `Your transaction with ID ${transaction.transaction_id} has been created with total payment ${totalPayment}`,
            notification_date: new Date(),
            user_id: parseInt(userData.user_id),
            is_read: false,
          },
        });

        return await tx.transaction.findUnique({
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
      },
      {
        isolationLevel: "Serializable",
      }
    );
  } catch (error) {
    console.error("[Error in createTransaction]:", error);
    throw error;
  }
}

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
  updateTransaction,
  deleteTransaction,
};