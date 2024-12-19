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
            
            if (error.message === 'TRANSACTIONS_NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Transactions not found for this user'
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
            console.error('Create transaction error:', error);

            if (error.message === 'INVALID_USER_DATA') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid user data provided'
                });
            }

            if (error.message === 'INVALID_PASSENGER_DATA') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid passenger data provided'
                });
            }

            if (error.message === 'INVALID_SEAT_SELECTIONS') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid seat selections provided'
                });
            }

            if (error.message === 'PLANE_NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Selected plane not found'
                });
            }

            if (error.message === 'SEATS_UNAVAILABLE') {
                return res.status(409).json({
                    status: 'error',
                    message: 'One or more selected seats are no longer available'
                });
            }

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
                parseInt(transaction_id),
                updateData
            );
            
            return res.status(200).json({
                status: 'success',
                message: 'Transaction updated successfully',
                data: updatedTransaction
            });
        } catch (error) {
            console.error('Update transaction error:', error);

            if (error.message === 'TRANSACTION_NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Transaction not found'
                });
            }

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            const { transaction_id } = req.params;
            
            await transactionsService.deleteTransaction(parseInt(transaction_id));
            
            return res.status(200).json({
                status: 'success',
                message: 'Transaction deleted successfully'
            });
        } catch (error) {
            console.error('Delete transaction error:', error);

            if (error.message === 'TRANSACTION_NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'Transaction not found'
                });
            }

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = transactionsController;