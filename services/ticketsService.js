const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTickets(transaction_id) {
    try {
        const existingTransaction = await prisma.transaction.findUnique({
            where: { 
                transaction_id: parseInt(transaction_id)
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
                                destination_airport: true
                            }
                        }
                    }
                }
            }
        });

        if (!existingTransaction) {
            throw new Error("INVALID_TRANSACTION");
        }

        if (!existingTransaction.tickets || existingTransaction.tickets.length === 0) {
            throw new Error("NO_TICKETS_FOUND");
        }

        return existingTransaction.tickets;
    } catch (error) {
        console.error("[Error in createTickets]:", error);
        throw error;
    }
}

async function updateTicket(ticket_id, updateData) {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { 
                ticket_id: parseInt(ticket_id)
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
                }
            }
        });

        if (!ticket) {
            throw new Error("TICKET_NOT_FOUND");
        }

        const updatedTicket = await prisma.ticket.update({
            where: { 
                ticket_id: parseInt(ticket_id)
            },
            data: updateData,
            include: {
                passenger: true,
                seat: true,
                plane: {
                    include: {
                        airline: true,
                        origin_airport: true,
                        destination_airport: true
                    }
                }
            }
        });

        return updatedTicket;
    } catch (error) {
        console.error("[Error in updateTicket]:", error);
        throw error;
    }
}

async function deleteTicket(ticket_id) {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { 
                ticket_id: parseInt(ticket_id)
            }
        });

        if (!ticket) {
            throw new Error("TICKET_NOT_FOUND");
        }

        await prisma.ticket.delete({
            where: { 
                ticket_id: parseInt(ticket_id)
            }
        });

        return true;
    } catch (error) {
        console.error("[Error in deleteTicket]:", error);
        throw error;
    }
}

module.exports = {
    createTickets,
    updateTicket,
    deleteTicket
};