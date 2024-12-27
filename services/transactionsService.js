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
    console.error(`Midtrans API Error for OrderID ${orderId}:`, error);
    return null;
  }
}

async function getMidtransStatusUpdates(midtransStatus, transaction) {
  let newStatus = transaction.status;
  let paymentStatus = PAYMENT_STATUS.PENDING;
  let notificationData = {
    title: "Payment Status Update",
    description: `Payment status updated for Order ID ${transaction.token}`
  };

  if (!midtransStatus || !midtransStatus.transaction_status) {
    return { newStatus, paymentStatus, notificationData };
  }

  switch (midtransStatus.transaction_status) {
    case "settlement":
    case "capture":
      newStatus = TRANSACTION_STATUS.SUCCESS;
      paymentStatus = PAYMENT_STATUS.SETTLEMENT;
      notificationData = {
        title: "Payment Successful",
        description: `Your payment for Order ID ${transaction.token} has been completed successfully.`
      };
      break;
    case "expire":
      newStatus = TRANSACTION_STATUS.FAILED;
      paymentStatus = PAYMENT_STATUS.EXPIRED;
      notificationData = {
        title: "Payment Expired",
        description: `Your payment for Order ID ${transaction.token} has expired.`
      };
      break;
    case "cancel":
      newStatus = TRANSACTION_STATUS.CANCELLED;
      paymentStatus = PAYMENT_STATUS.CANCELLED;
      notificationData = {
        title: "Payment Cancelled",
        description: `Your payment for Order ID ${transaction.token} has been cancelled.`
      };
      break;
    case "deny":
    case "failure":
      newStatus = TRANSACTION_STATUS.FAILED;
      paymentStatus = PAYMENT_STATUS.FAILURE;
      notificationData = {
        title: "Payment Failed",
        description: `Your payment for Order ID ${transaction.token} has failed.`
      };
      break;
  }

  return { newStatus, paymentStatus, notificationData };
}

async function createTransaction(userData, passengerData, seatSelections, planeId) {
  try {
    validateTransactionData(userData, passengerData, seatSelections, planeId);

    const plane = await prisma.plane.findUnique({
      where: { plane_id: parseInt(planeId) },
      include: {
        origin_airport: true,
        destination_airport: true,
      },
    });

    if (!plane) throw new Error("PLANE_NOT_FOUND");

    return await prisma.$transaction(
      async (tx) => {
        return await createSingleTransaction(
          tx,
          userData,
          passengerData,
          seatSelections,
          planeId,
          "single"
        );
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

async function validateTransactionData(userData, passengerData, seatSelections, planeId) {
  if (!userData?.user_id) throw new Error("INVALID_USER_DATA");
  if (!Array.isArray(passengerData) || passengerData.length === 0)
    throw new Error("INVALID_PASSENGER_DATA");
  if (!Array.isArray(seatSelections) || seatSelections.length === 0)
    throw new Error("INVALID_SEAT_SELECTIONS");
  if (!planeId) throw new Error("INVALID_PLANE_ID");
}

async function updateTransactionStatus(transaction, tx) {
  try {
    if (!transaction) {
      console.error('Transaction object is undefined');
      return null;
    }

    if (transaction.status === TRANSACTION_STATUS.PENDING && transaction.token) {
      const midtransStatus = await checkMidtransStatus(transaction.token);
      
      const { newStatus, paymentStatus, notificationData } = 
        await getMidtransStatusUpdates(midtransStatus, transaction);

      if (newStatus !== transaction.status) {
        try {
          const [updatedTransaction] = await Promise.all([
            tx.transaction.update({
              where: { transaction_id: transaction.transaction_id },
              data: {
                status: newStatus,
                message: notificationData.description
              },
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
            }),
            tx.payment.update({
              where: { orderId: transaction.token },
              data: {
                status: paymentStatus,
                transactionId: midtransStatus?.transaction_id || null,
              },
            }),
            tx.notification.create({
              data: {
                title: notificationData.title,
                description: notificationData.description,
                notification_date: new Date(),
                user_id: transaction.user_id,
                is_read: false,
              },
            }),
          ]);

          return updatedTransaction;
        } catch (error) {
          console.error('Error updating transaction data:', error);
          return transaction;
        }
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

async function createRoundTripTransaction(
  userData,
  passengerData,
  outboundSeatSelections,
  outboundPlaneId,
  returnSeatSelections,
  returnPlaneId
) {
  try {
    validateRoundTripData(
      userData,
      passengerData,
      outboundSeatSelections,
      outboundPlaneId,
      returnSeatSelections,
      returnPlaneId
    );

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
      }),
    ]);

    validatePlanes(outboundPlane, returnPlane);

    return await prisma.$transaction(
      async (tx) => {
        const outboundTransaction = await createSingleTransaction(
          tx,
          userData,
          passengerData,
          outboundSeatSelections,
          outboundPlaneId,
          "outbound"
        );

        const returnTransaction = await createSingleTransaction(
          tx,
          userData,
          passengerData,
          returnSeatSelections,
          returnPlaneId,
          "return"
        );

        await Promise.all([
          tx.transaction.update({
            where: { transaction_id: outboundTransaction.transaction_id },
            data: {
              trip_type: "outbound",
              related_transaction_id: returnTransaction.transaction_id
            }
          }),
          tx.transaction.update({
            where: { transaction_id: returnTransaction.transaction_id },
            data: {
              trip_type: "return",
              related_transaction_id: outboundTransaction.transaction_id
            }
          })
        ]);

        await createRoundTripNotification(tx, userData.user_id, outboundTransaction, returnTransaction);

        return {
          outbound: outboundTransaction,
          return: returnTransaction
        };
      },
      {
        isolationLevel: "Serializable",
      }
    );
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
  const selectedSeats = await validateAndGetSeats(tx, seatSelections);
  
  try {
    await checkSeatAvailability(tx, selectedSeats, seatSelections);
    const { baseAmount, tax, totalPayment } = calculatePayments(selectedSeats);
    const transaction = await tx.transaction.create({
      data: {
        status: TRANSACTION_STATUS.PENDING,
        redirect_url: "",
        transaction_date: new Date(),
        token: generateToken(),
        message: `${transactionType} transaction initiated`,
        total_payment: totalPayment,
        base_amount: baseAmount,
        tax_amount: tax,
        user_id: parseInt(userData.user_id),
        trip_type: transactionType,
      },
    });

    const passengers = await createPassengers(tx, passengerData);
    await createTicketsAndUpdateSeats(tx, transaction, passengers, selectedSeats, planeId);

    return await getCompleteTransactionData(tx, transaction.transaction_id);
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error("CONCURRENCY_ERROR");
    }
    throw error;
  }
}

async function validateAndGetSeats(tx, seatSelections) {
  try {
    const selectedSeats = await Promise.all(
      seatSelections.map(async (selection) => {
        const seat = await tx.seat.findUnique({
          where: { 
            seat_id: parseInt(selection.seat_id),
            is_available: true
          },
          select: {
            seat_id: true,
            is_available: true,
            version: true,
            price: true
          }
        });

        if (!seat) {
          throw new Error("SEATS_UNAVAILABLE");
        }

        return seat;
      })
    );
    const unavailableSeats = selectedSeats.filter(seat => !seat.is_available);
    if (unavailableSeats.length > 0) {
      throw new Error("SEATS_UNAVAILABLE");
    }

    return selectedSeats;
  } catch (error) {
    console.error("[Error in validateAndGetSeats]:", error);
    throw error;
  }
}

async function checkSeatAvailability(tx, selectedSeats, seatSelections) {
  const currentSeats = await Promise.all(
    seatSelections.map(selection =>
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
}

function calculatePayments(selectedSeats) {
  const baseAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const tax = Math.round(baseAmount * 0.1);
  const totalPayment = baseAmount + tax;
  return { baseAmount, tax, totalPayment };
}

async function createPassengers(tx, passengerData) {
  return await Promise.all(
    passengerData.map(passenger =>
      tx.passenger.create({
        data: {
          title: passenger.title,
          full_name: passenger.full_name,
          family_name: passenger.family_name || null,
          nationality: passenger.nationality,
          id_number: passenger.id_number || null,
          id_issuer: passenger.id_issuer || null,
          id_expiry: passenger.id_expiry ? new Date(passenger.id_expiry) : null,
          birth_date: passenger.birth_date ? new Date(passenger.birth_date) : null,
        },
      })
    )
  );
}

async function createTicketsAndUpdateSeats(tx, transaction, passengers, selectedSeats, planeId) {
  const tickets = [];
  for (let index = 0; index < selectedSeats.length; index++) {
    const seat = selectedSeats[index];
    await tx.seat.update({
      where: {
        seat_id: seat.seat_id,
        version: seat.version,
        is_available: true
      },
      data: {
        is_available: false, 
        version: { increment: 1 }
      }
    });
    
    tickets.push(await tx.ticket.create({
      data: {
        transaction_id: transaction.transaction_id,
        plane_id: parseInt(planeId),
        passenger_id: passengers[index].passenger_id,
        seat_id: seat.seat_id
      }
    }));
  }
  return tickets;
}

async function getCompleteTransactionData(tx, transactionId) {
  return await tx.transaction.findUnique({
    where: { transaction_id: transactionId },
    include: {
      related_transaction: true,
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

function generateToken() {
  return Math.random().toString(36).substring(7);
}

function validateRoundTripData(
  userData,
  passengerData,
  outboundSeatSelections,
  outboundPlaneId,
  returnSeatSelections,
  returnPlaneId
) {
  if (!userData?.user_id) throw new Error("INVALID_USER_DATA");
  if (!Array.isArray(passengerData) || passengerData.length === 0)
    throw new Error("INVALID_PASSENGER_DATA");
  if (
    !Array.isArray(outboundSeatSelections) ||
    outboundSeatSelections.length === 0 ||
    !Array.isArray(returnSeatSelections) ||
    returnSeatSelections.length === 0
  )
    throw new Error("INVALID_SEAT_SELECTIONS");
    if (!outboundPlaneId || !returnPlaneId) throw new Error("INVALID_PLANE_ID");
  }
  
  function validatePlanes(outboundPlane, returnPlane) {
    if (!outboundPlane || !returnPlane) {
      throw new Error("PLANE_NOT_FOUND");
    }
  
    if (
      new Date(returnPlane.departure_date) <= new Date(outboundPlane.departure_date)
    ) {
      throw new Error("INVALID_RETURN_FLIGHT");
    }
  
    if (
      outboundPlane.destination_airport.airport_id !==
      returnPlane.origin_airport.airport_id
    ) {
      throw new Error("INVALID_RETURN_FLIGHT");
    }
  }
  
  async function createRoundTripNotification(tx, userId, outboundTransaction, returnTransaction) {
    await tx.notification.create({
      data: {
        title: "Round Trip Booking Confirmed",
        description: `Your round trip booking has been confirmed. Outbound flight: ${outboundTransaction.transaction_id}, Return flight: ${returnTransaction.transaction_id}`,
        notification_date: new Date(),
        user_id: parseInt(userId),
        is_read: false,
      },
    });
  }
  
  async function updateTransaction(transactionId, updateData) {
    try {
      const transaction = await prisma.transaction.update({
        where: { transaction_id: transactionId },
        data: {
          ...updateData,
          version: { increment: 1 }
        },
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
    createRoundTripTransaction,
    updateTransaction,
    deleteTransaction,
    PAYMENT_STATUS,
    TRANSACTION_STATUS
  };