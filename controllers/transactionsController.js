const transactionService = require('../services/transactionsService');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found.' });
    }
    res.status(200).json({
      message: 'Succes to fetch transactions.',
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transactions.',
      error: error.message
    });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const newTransaction = await transactionService.createTransaction(transactionData);
    res.status(201).json({
      message: 'Transaksi berhasil dibuat.',
      data: newTransaction
    });
  } catch (error) {
    if (error.message.includes('Transaction data not found') || error.message.includes('User with that ID not found')) {
      return res.status(400).json({
        message: 'Failed to create transaction.',
        error: error.message
      });
    }
    res.status(500).json({
      message: 'Failed to create transaction server error.',
      error: error.message
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const updatedTransaction = await transactionService.updateTransaction(transaction_id, req.body);
    res.status(200).json({
      message: 'Transaction updated successfully.',
      data: updatedTransaction
    });
  } catch (error) {
    if (error.message.includes('Invalid transaction ID or data') || error.message.includes('Transaction with that ID not found')) {
      return res.status(400).json({
        message: 'Failed to update transaction.',
        error: error.message
      });
    }
    res.status(500).json({
      message: 'Failed to update transaction server error.',
      error: error.message
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    await transactionService.deleteTransaction(transaction_id);
    res.status(200).json({
      message: 'Transaction successfully deleted.'
    });
  } catch (error) {
    if (error.message.includes('Invalid transaction ID') || error.message.includes('Transaction with that ID not found')) {
      return res.status(400).json({
        message: 'Failed to delete transaction.',
        error: error.message
      });
    }
    res.status(500).json({
      message: 'Failed to delete transaction server error.',
      error: error.message
    });
  }
};
