const ticketsService = require('../services/ticketsService');
const QRCode = require('qrcode');

const ticketsController = {
    createTickets: async (req, res) => {
        try {
            const { transaction_id } = req.body;
            
            if (!transaction_id) {
                return res.status(400).json({
                    message: 'Transaction ID is required',
                    status: 400
                });
            }

            const tickets = await ticketsService.createTickets(transaction_id);

            // Generate QR codes for all tickets
            const ticketResponses = await Promise.all(tickets.map(async (ticket) => {
                const qrCodeData = {
                    ticket_id: ticket.ticket_id,
                    passenger: ticket.passenger.full_name,
                    seat: ticket.seat.seat_number,
                    flight_number: ticket.plane.plane_code,
                    airline: ticket.plane.airline.airline_name,
                    class: ticket.seat.class,
                    departure_time: ticket.plane.departure_time,
                    from: ticket.plane.origin_airport.airport_code,
                    to: ticket.plane.destination_airport.airport_code
                };

                const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));

                return {
                    ticket_details: {
                        ticket_id: ticket.ticket_id,
                        passenger_name: ticket.passenger.full_name,
                        seat_number: ticket.seat.seat_number,
                        class: ticket.seat.class,
                        flight_number: ticket.plane.plane_code,
                        airline: ticket.plane.airline.airline_name,
                        departure_time: ticket.plane.departure_time,
                        departure_airport: ticket.plane.origin_airport.airport_code,
                        arrival_airport: ticket.plane.destination_airport.airport_code
                    },
                    qrCode
                };
            }));

            return res.status(201).json({
                status: 201,
                message: 'Tickets issued successfully',
                data: ticketResponses
            });
        } catch (error) {
            console.error('Create tickets error:', error);
            
            const errorMessages = {
                'INVALID_TRANSACTION': 'Invalid transaction ID',
                'NO_TICKETS_FOUND': 'No tickets found for this transaction',
                'TICKETS_ALREADY_PROCESSED': 'Tickets have already been processed for this transaction'
            };

            /* istanbul ignore next */
            if (errorMessages[error.message]) {
                /* istanbul ignore next */
                return res.status(400).json({
                    message: errorMessages[error.message],
                    status: 400
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
            });
        }
    },

    updateTicket: async (req, res) => {
        try {
            const { ticket_id } = req.params;
            const updateData = req.body;
            /* istanbul ignore next*/
            if (!ticket_id) {
                /* istanbul ignore next */
                return res.status(400).json({
                    message: 'Ticket ID is required',
                    status: 400
                });
            }
            
            const updatedTicket = await ticketsService.updateTicket(ticket_id, updateData);
            
            /* istanbul ignore next */
            return res.status(200).json({
                message: 'Ticket updated successfully',
                status: 200,
                data: updatedTicket
            });
        } catch (error) {
            console.error('Update ticket error:', error);
            
            const errorMessages = {
                'TICKET_NOT_FOUND': 'Ticket not found',
                'TICKET_ALREADY_USED': 'Cannot update a completed ticket'
            };

            if (errorMessages[error.message]) {
                return res.status(400).json({
                    message: errorMessages[error.message],
                    status: 400
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
            });
        }
    },

    deleteTicket: async (req, res) => {
        try {
            const { ticket_id } = req.params;
            
            /* istanbul ignore next */
            if (!ticket_id) {
                return res.status(400).json({
                    message: 'Ticket ID is required',
                    status: 400
                });
            }

            await ticketsService.deleteTicket(ticket_id);
            
            /* istanbul ignore next */
            return res.status(200).json({
                message: 'Ticket deleted successfully',
                status: 200
            });
        } catch (error) {
            console.error('Delete ticket error:', error);
            
            const errorMessages = {
                'TICKET_NOT_FOUND': 'Ticket not found',
                'TICKET_ALREADY_USED': 'Cannot delete a completed ticket'
            };

            if (errorMessages[error.message]) {
                return res.status(400).json({
                    message: errorMessages[error.message],
                    status: 400
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
            });
        }
    }
};

module.exports = ticketsController;