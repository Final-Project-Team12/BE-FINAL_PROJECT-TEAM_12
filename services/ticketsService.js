const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTicket(ticketData) {
    try {
        const { transaction_id, plane_id, passenger_id, seat_id } = ticketData;
        const existingTransaction = await prisma.transaction.findUnique({
            where: { 
                transaction_id: parseInt(transaction_id)
            },
            include: {
                tickets: {
                    include: {
                        passenger: true,
                        seat: true,
                        plane: true
                    }
                }
            }
        });

        if (!existingTransaction) {
            throw new Error("INVALID_TRANSACTION");
        }

        const existingTicket = existingTransaction.tickets[0];
        if (!existingTicket) {
            throw new Error("NO_TICKET_FOUND");
        }
        if (parseInt(plane_id) !== existingTicket.plane_id) {
            throw new Error("INVALID_PLANE_ID");
        }
        if (parseInt(passenger_id) !== existingTicket.passenger_id) {
            throw new Error("INVALID_PASSENGER_ID");
        }
        if (parseInt(seat_id) !== existingTicket.seat_id) {
            throw new Error("INVALID_SEAT_ID");
        }

        const ticket = await prisma.ticket.findFirst({
            where: { 
                transaction_id: parseInt(transaction_id)
            },
            include: {
                passenger: true,
                seat: true,
                plane: {
                    include: {
                        airline: true,
                        origin_airport: true,
                        destination_airport: true
                    }
                },
                transaction: true
            }
        });

        return ticket;
    } catch (error) {
        console.error("[Error in createTicket]:", error);
        throw error;
    }
}

async function updateTicket(ticket_id, updateData) {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { ticket_id: parseInt(ticket_id) },
            include: {
                transaction: true,
                passenger: true,
                seat: true,
                plane: true
            },
        });

        if (!ticket) {
            throw new Error("TICKET_NOT_FOUND");
        }

        if (ticket.transaction.status === "COMPLETED") {
            throw new Error("TICKET_ALREADY_USED");
        }

        return await prisma.ticket.update({
            where: { ticket_id: parseInt(ticket_id) },
            data: updateData,
            include: {
                passenger: true,
                seat: true,
                plane: true,
            },
        });
    } catch (error) {
        console.error("[Error in updateTicket]:", error);
        throw error;
    }
}

async function deleteTicket(ticket_id) {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { ticket_id: parseInt(ticket_id) },
            include: {
                transaction: true,
            },
        });

        if (!ticket) {
            throw new Error("TICKET_NOT_FOUND");
        }

        if (ticket.transaction.status === "COMPLETED") {
            throw new Error("TICKET_ALREADY_USED");
        }

        return await prisma.ticket.delete({
            where: { ticket_id: parseInt(ticket_id) },
        });
    } catch (error) {
        console.error("[Error in deleteTicket]:", error);
        throw error;
    }
}

module.exports = {
    createTicket,
    updateTicket,
    deleteTicket,
};