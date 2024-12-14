const transactionsService = require('../services/transactionsService');

const transactionsController = {
  getTransactionsByUserId: async (req, res) => {
    try {
        const { user_id } = req.params;
        
        const transactions = await transactionsService.getTransactionsByUserId(parseInt(user_id));
        
        return res.status(200).json({
            status: 'success',
            message: 'Transactions retrieved successfully',
            data: transactions
        });
    } catch (error) {
        console.error('Get transactions by user ID error:', error);
        
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
  },

    createTransaction: async (req, res) => {
        try {
            const { userData, passengerData, seatSelections, planeId } = req.body;
            
            const result = await transactionsService.createTransaction(
                userData,
                passengerData,
                seatSelections,
                planeId
            );

            return res.status(201).json({
                status: 'success',
                message: 'Transaction created successfully',
                data: result
            });
        } catch (error) {
            if (error.message === 'SEATS_UNAVAILABLE') {
                return res.status(409).json({
                    status: 'error',
                    message: 'One or more selected seats are no longer available'
                });
            }
            if (error.message === 'INVALID_SEATS_SELECTED') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid seat selection'
                });
            }
            console.error('Create transaction error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    updateTransaction: async (req, res) => {
        try {
            const { transaction_id } = req.params;
            const updateData = req.body;
            
            const updatedTransaction = await transactionsService.updateTransaction(
                transaction_id,
                updateData
            );
            
            return res.status(200).json({
                status: 'success',
                message: 'Transaction updated successfully',
                data: updatedTransaction
            });
        } catch (error) {
            console.error('Update transaction error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            const { transaction_id } = req.params;
            
            await transactionsService.deleteTransaction(transaction_id);
            
            return res.status(200).json({
                status: 'success',
                message: 'Transaction deleted successfully'
            });
        } catch (error) {
            console.error('Delete transaction error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = transactionsController;