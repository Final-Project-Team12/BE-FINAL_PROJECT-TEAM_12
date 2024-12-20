const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getTransactionsByUserId(userId) {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const transactions = await prisma.transaction.findMany({
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

        return transactions;
    } catch (error) {
        console.error("[Error in getTransactionsByUserId]:", error);
        throw error;
    }
}

async function createTransaction(userData, passengerData, seatSelections, planeId) {
  try {
      if (!userData?.user_id) throw new Error("INVALID_USER_DATA");
      if (!Array.isArray(passengerData) || passengerData.length === 0)
          throw new Error("INVALID_PASSENGER_DATA");
      if (!Array.isArray(seatSelections) || seatSelections.length === 0)
          throw new Error("INVALID_SEAT_SELECTIONS");
      if (!planeId) throw new Error("INVALID_PLANE_ID");

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

      const totalPayment = selectedSeats.reduce(
          (sum, seat) => sum + seat.price,
          0
      );

        return await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    status: "PENDING",
                    redirect_url: "",
                    transaction_date: new Date(),
                    token: Math.random().toString(36).substring(7),
                    message: "Transaction initiated",
                    total_payment: totalPayment,
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
                    await tx.seat.update({
                        where: { seat_id: parseInt(selection.seat_id) },
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
                    is_read: false
                }
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
        });
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