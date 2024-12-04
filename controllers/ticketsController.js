const ticketService = require('../services/ticketsService');

exports.createTicket = async (req, res) => {
  try {
    const ticketData = req.body;
    if (!ticketData.transaction_id || !ticketData.plane_id || !ticketData.seat_id || !ticketData.class || !ticketData.price) {
      return res.status(400).json({
        message: 'Ticket data is incomplete.',
        error: 'Make sure all columns (transaction_id, plane_id, seat_id, class, price) are filled in.'
      });
    }

    const newTicket = await ticketService.createTicket(ticketData);

    res.status(201).json({
      message: 'Ticket created successfully.',
      data: newTicket
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create ticket.',
      error: error.message
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const updatedTicket = await ticketService.updateTicket(ticket_id, req.body);

    if (!updatedTicket) {
      return res.status(404).json({
        message: 'Ticket not found.',
        error: `Ticket with ID ${ticket_id} not found.`
      });
    }

    res.status(200).json({
      message: 'Ticket updated successfully.',
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update ticket.',
      error: error.message
    });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const deletedTicket = await ticketService.deleteTicket(ticket_id);

    if (!deletedTicket) {
      return res.status(404).json({
        message: 'Ticket not found.',
        error: `Ticket with ID ${ticket_id} not found.`
      });
    }

    res.status(200).json({
      message: 'Ticket successfully deleted.',
      data: deletedTicket
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to delete ticket.',
      error: error.message
    });
  }
};