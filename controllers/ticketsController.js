const ticketService = require('../services/ticketsService');

exports.createTicket = async (req, res) => {
  try {
    const ticketData = req.body;
    if (!ticketData.transaction_id || !ticketData.plane_id || !ticketData.passenger_id || !ticketData.seat_id) {
      return res.status(400).json({
        message: 'Ticket data is incomplete.',
        status:'400',
        error: 'Make sure all columns (transaction_id, plane_id, passenger_id, seat_id) are filled in.'
      });
    }

    const newTicket = await ticketService.createTicket(ticketData);

    res.status(201).json({
      message: 'Ticket created successfully.',
      status:'201',
      data: newTicket
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create ticket.',
      status:'400',
      error: error.message
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const updatedTicket = await ticketService.updateTicket(ticket_id, req.body);

    res.status(200).json({
      message: 'Ticket updated successfully.',
      status:'200',
      data: updatedTicket,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update ticket.',
      status:'400',
      error: error.message,
    });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const deletedTicket = await ticketService.deleteTicket(ticket_id);

    res.status(200).json({
      message: 'Ticket successfully deleted.',
      status:'200',
      data: deletedTicket,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to delete ticket.',
      status:'400',
      error: error.message,
    });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await ticketService.getAllTransactions();
    res.status(200).json({
      message: 'Success to fetch transactions.',
      status:'200',
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transactions.',
      status:'500',
      error: error.message,
    });
  }
};