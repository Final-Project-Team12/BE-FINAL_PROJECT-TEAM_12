const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getTransactionsByUserId(userId) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId },
      include: {
        tickets: {
          include: {
            passenger: true,
            seat: true,
            plane: true,
          },
        },
        user: true,
      },
      orderBy: {
        transaction_date: "desc",
      },
    });

    if (!transactions) {
      throw new Error("TRANSACTIONS_NOT_FOUND");
    }

    return transactions;
  } catch (error) {
    console.error("[Error in getTransactionsByUserId]:", error.message);
    throw new Error("Failed to get transactions history");
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

    const plane = await prisma.plane.findUnique({
      where: { plane_id: parseInt(planeId) },
    });

    if (!plane) {
      console.error("[createTransaction] Plane not found:", planeId);
      throw new Error("PLANE_NOT_FOUND");
    }

    const seatChecks = await Promise.all(
      seatSelections.map(async (selection) => {
        const seat = await prisma.seat.findUnique({
          where: { seat_id: parseInt(selection.seat_id) },
        });
        return seat && seat.is_available;
      })
    );

    if (seatChecks.includes(false)) {
      console.error("[createTransaction] Invalid seats found:", seatChecks);
      throw new Error("INVALID_SEATS_SELECTED");
    }

    return await prisma.$transaction(async (tx) => {
      // Create initial transaction record
      const transaction = await tx.transaction.create({
        data: {
          status: "PENDING",
          redirect_url: "",
          transaction_date: new Date(),
          token: Math.random().toString(36).substring(7),
          message: "Transaction initiated",
          total_payment: 0,
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
              id_number: passenger.id_number,
              id_issuer: passenger.id_issuer,
              id_expiry: passenger.id_expiry
                ? new Date(passenger.id_expiry)
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

      // Update transaction with final details
      return await tx.transaction.update({
        where: { transaction_id: transaction.transaction_id },
        data: {
          total_payment: tickets.length * 500000,
          message: "Transaction completed successfully",
        },
        include: {
          tickets: {
            include: {
              passenger: true,
              seat: true,
            },
          },
        },
      });
    });
  } catch (error) {
    console.error("[Error in createTransaction]:", error.message);
    throw new Error("Failed to create transaction");
  }
}

module.exports = {
  getTransactionsByUserId,
  createTransaction,
};
