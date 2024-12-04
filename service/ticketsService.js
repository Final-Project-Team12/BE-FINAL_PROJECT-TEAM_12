const prisma = require('../prisma/client');

exports.createTicket = async (data) => {
  if (!data.transaction_id || !data.plane_id || !data.seat_id || !data.class || !data.price) {
    throw new Error('Ticket data is incomplete.');
  }
  const existingTicket = await prisma.tickets.findFirst({
    where: { seat_id: data.seat_id }
  });
  if (existingTicket) {
    throw new Error('Seat has been reserved.');
  }
  return await prisma.tickets.create({ data });
};

exports.updateTicket = async (ticket_id, data) => {
  return await prisma.tickets.update({
    where: { ticket_id: parseInt(ticket_id) },
    data,
  });
};

exports.deleteTicket = async (ticket_id) => {
  return await prisma.tickets.delete({
    where: { ticket_id: parseInt(ticket_id) }
  });
};
