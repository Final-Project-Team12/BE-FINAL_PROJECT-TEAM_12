const ticketsService = require('../services/ticketsService');
const QRCode = require('qrcode');

const ticketsController = {
    createTicket: async (req, res) => {
        try {
            const { transaction_id, plane_id, passenger_id, seat_id } = req.body;
            if (!transaction_id || !plane_id || !passenger_id || !seat_id) {
                return res.status(400).json({
                    message: 'All fields (transaction_id, plane_id, passenger_id, seat_id) are required',
                    status: 400,
                });
            }

            const result = await ticketsService.createTicket({ 
                transaction_id, 
                plane_id, 
                passenger_id, 
                seat_id 
            });
            
            // Generate QR Code dengan informasi tiket
            const qrCodeData = {
                ticket_id: result.ticket_id,
                passenger: result.passenger.full_name,
                seat: result.seat.seat_number,
                flight_number: result.plane.plane_code,
                airline: result.plane.airline.airline_name,
                class: result.seat.class,
                departure_time: result.plane.departure_time,
                from: result.plane.origin_airport.airport_code,
                to: result.plane.destination_airport.airport_code
            };

            const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
            
            return res.status(201).json({
                status: 201,
                message: 'Ticket issued successfully',
                data: {
                    ticket_details: {
                        ticket_id: result.ticket_id,
                        passenger_name: result.passenger.full_name,
                        seat_number: result.seat.seat_number,
                        class: result.seat.class,
                        flight_number: result.plane.plane_code,
                        airline: result.plane.airline.airline_name,
                        departure_time: result.plane.departure_time,
                        departure_airport: result.plane.origin_airport.airport_code,
                        arrival_airport: result.plane.destination_airport.airport_code
                    },
                    qrCode
                }
            });
        } catch (error) {
            console.error('Create ticket error:', error);
            
            const errorMessages = {
                'NO_TICKET_FOUND': 'No ticket found for this transaction',
                'INVALID_TRANSACTION': 'Invalid transaction ID',
                'INVALID_PLANE_ID': 'Plane ID does not match the transaction',
                'INVALID_PASSENGER_ID': 'Passenger ID does not match the transaction',
                'INVALID_SEAT_ID': 'Seat ID does not match the transaction'
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

    updateTicket: async (req, res) => {
        try {
            const { ticket_id } = req.params;
            const updateData = req.body;
            
            if (!ticket_id) {
                return res.status(400).json({
                    message: 'Ticket ID is required',
                    status: 400
                });
            }
            
            const updatedTicket = await ticketsService.updateTicket(ticket_id, updateData);
            
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
            
            if (!ticket_id) {
                return res.status(400).json({
                    message: 'Ticket ID is required',
                    status: 400
                });
            }

            await ticketsService.deleteTicket(ticket_id);
            
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
                status: 201
            });
        }
    }
};

module.exports = ticketsController;