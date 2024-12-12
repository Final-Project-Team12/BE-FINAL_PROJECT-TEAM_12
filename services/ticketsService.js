const prisma = require('../prisma/client');

exports.createTicket = async (data) => {
  if (!data.transaction_id || !data.plane_id || !data.passenger_id || !data.seat_id) {
    throw new Error('Ticket data is incomplete.');
  }
  await prisma.transaction.findUniqueOrThrow({
    where: { transaction_id: data.transaction_id },
  });

  await prisma.passenger.findUniqueOrThrow({
    where: { passenger_id: data.passenger_id },
  });

  await prisma.seat.findUniqueOrThrow({
    where: { seat_id: data.seat_id },
  });
  return await prisma.ticket.create({
    data: {
      transaction_id: data.transaction_id,
      plane_id: data.plane_id,
      passenger_id: data.passenger_id,
      seat_id: data.seat_id,
    },
  });
};



exports.updateTicket = async (ticket_id, data) => {
  const existingTicket = await prisma.ticket.findUnique({
    where: { ticket_id: parseInt(ticket_id) }
  });

  if (!existingTicket) {
    throw new Error('Ticket not found.');
  }

  const updateData = {};

  if (data.seat_id) {
    await prisma.seat.findUniqueOrThrow({
      where: { seat_id: data.seat_id }
    });

    updateData.seat_id = data.seat_id;
  }

  if (data.class) {
    const seat = await prisma.seat.findUnique({
      where: { seat_id: existingTicket.seat_id }
    });

    if (!seat) {
      throw new Error('Associated seat not found.');
    }

    await prisma.seat.update({
      where: { seat_id: seat.seat_id },
      data: { class: data.class }
    });
  }

  if (Object.keys(updateData).length > 0) {
    return await prisma.ticket.update({
      where: { ticket_id: parseInt(ticket_id) },
      data: updateData,
    });
  }
  return existingTicket;
};
exports.getAllTransactions = async () => {
  return await prisma.transaction.findMany({
    include: {
      tickets: {
        include: {
          seat: true,
        },
      },
    },
  });
};
exports.deleteTicket = async (ticket_id) => {
  return await prisma.ticket.delete({
    where: { ticket_id: parseInt(ticket_id) }
  });
};