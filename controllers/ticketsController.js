const ticketsService = require('../services/ticketsService');
const QRCode = require('qrcode');

const ticketsController = {
    createTicket: async (req, res) => {
        try {
            const ticketData = req.body;
            
            if (!ticketData.transaction_id || !ticketData.plane_id || 
                !ticketData.passenger_id || !ticketData.seat_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields'
                });
            }

            const result = await ticketsService.createTicket(ticketData);
            
            const qrCode = await QRCode.toDataURL(JSON.stringify({
                ticket_id: result.ticket_id,
                passenger: result.passenger.full_name,
                seat: result.seat.seat_number
            }));
            
            return res.status(201).json({
                status: 'success',
                message: 'Ticket created successfully',
                data: { ...result, qrCode }
            });
        } catch (error) {
            if (error.message === 'SEAT_ALREADY_TAKEN') {
                return res.status(409).json({
                    status: 'error',
                    message: 'Selected seat is no longer available'
                });
            }
            if (error.message === 'INVALID_PASSENGER') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid passenger information'
                });
            }
            if (error.message === 'INVALID_TRANSACTION') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid transaction information'
                });
            }
            console.error('Create ticket error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    updateTicket: async (req, res) => {
        try {
            const { ticket_id } = req.params;
            const updateData = req.body;
            
            if (!ticket_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ticket ID is required'
                });
            }
            
            const updatedTicket = await ticketsService.updateTicket(ticket_id, updateData);
            
            return res.status(200).json({
                status: 'success',
                message: 'Ticket updated successfully',
                data: updatedTicket
            });
        } catch (error) {
            if (error.message === 'TICKET_NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ticket not found'
                });
            }
            if (error.message === 'INVALID_UPDATE_DATA') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid update data'
                });
            }
            console.error('Update ticket error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    deleteTicket: async (req, res) => {
        try {
            const { ticket_id } = req.params;
            
            if (!ticket_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ticket ID is required'
                });
            }

            await ticketsService.deleteTicket(ticket_id);
            
            return res.status(200).json({
                status: 'success',
                message: 'Ticket deleted successfully'
            });
        } catch (error) {
            if (error.message === 'TICKET_NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ticket not found'
                });
            }
            if (error.message === 'TICKET_ALREADY_USED') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot delete a used ticket'
                });
            }
            console.error('Delete ticket error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = ticketsController;