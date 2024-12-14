const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTicket(ticketData) {
  try {
    const { transaction_id, plane_id, passenger_id, seat_id } = ticketData;

    const passenger = await prisma.passenger.findUnique({
      where: { passenger_id: parseInt(passenger_id) },
    });

    if (!passenger) {
      throw new Error("INVALID_PASSENGER");
    }

    const seat = await prisma.seat.findUnique({
      where: { seat_id: parseInt(seat_id) },
    });

    if (!seat || !seat.is_available) {
      throw new Error("SEAT_ALREADY_TAKEN");
    }

    return await prisma.$transaction(async (prisma) => {
      await prisma.seat.update({
        where: {
          seat_id: parseInt(seat_id),
          is_available: true,
          version: seat.version,
        },
        data: {
          is_available: false,
          version: { increment: 1 },
        },
      });

      return await prisma.ticket.create({
        data: {
          transaction_id: parseInt(transaction_id),
          plane_id: parseInt(plane_id),
          passenger_id: parseInt(passenger_id),
          seat_id: parseInt(seat_id),
        },
        include: {
          passenger: true,
          seat: true,
        },
      });
    });
  } catch (error) {
    console.error("[Error in createTicket]:", error.message);
    throw new Error("Failed to create ticket");
  }
}

async function updateTicket(ticket_id, updateData) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: parseInt(ticket_id) },
    });

    if (!ticket) {
      throw new Error("TICKET_NOT_FOUND");
    }

    if (updateData.seat_id) {
      const newSeat = await prisma.seat.findUnique({
        where: { seat_id: parseInt(updateData.seat_id) },
      });

      if (!newSeat || !newSeat.is_available) {
        throw new Error("SEAT_ALREADY_TAKEN");
      }
    }

    return await prisma.ticket.update({
      where: { ticket_id: parseInt(ticket_id) },
      data: updateData,
      include: {
        passenger: true,
        seat: true,
      },
    });
  } catch (error) {
    console.error("[Error in updateTicket]:", error.message);
    throw new Error("Failed to update ticket");
  }
}

async function deleteTicket(ticket_id) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: parseInt(ticket_id) },
    });

    if (!ticket) {
      throw new Error("TICKET_NOT_FOUND");
    }

    const transaction = await prisma.transaction.findUnique({
      where: { transaction_id: ticket.transaction_id },
    });

    if (transaction.status === "COMPLETED") {
      throw new Error("TICKET_ALREADY_USED");
    }

    return await prisma.$transaction(async (prisma) => {
      await prisma.seat.update({
        where: { seat_id: ticket.seat_id },
        data: {
          is_available: true,
          version: { increment: 1 },
        },
      });

      return await prisma.ticket.delete({
        where: { ticket_id: parseInt(ticket_id) },
      });
    });
  } catch (error) {
    console.error("[Error in deleteTicket]:", error.message);
    throw new Error("Failed to delete ticket");
  }
}

module.exports = {
  createTicket,
  updateTicket,
  deleteTicket,
};