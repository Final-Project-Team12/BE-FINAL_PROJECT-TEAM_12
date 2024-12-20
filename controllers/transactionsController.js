const transactionsService = require('../services/transactionsService');

const transactionsController = {
    getTransactionsByUserId: async (req, res) => {
        try {
            const { user_id } = req.params;
            
            const transactions = await transactionsService.getTransactionsByUserId(parseInt(user_id));
            
            return res.status(200).json({
                message: 'Transactions retrieved successfully',
                status: 200,
                data: transactions
            });
        } catch (error) {
            console.error('Get transactions by user ID error:', error);
            
            if (error.message === 'TRANSACTIONS_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Transactions not found for this user',
                    status: 404
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
            });
        }
    },

    createTransaction: async (req, res) => {
        try {
            const { 
                userData, 
                passengerData, 
                seatSelections, 
                planeId,
                isRoundTrip,
                returnPlaneId,
                returnSeatSelections 
            } = req.body;

            if (isRoundTrip && (!returnPlaneId || !returnSeatSelections)) {
                return res.status(400).json({
                    message: 'Return flight details are required for round trip',
                    status: 400
                });
            }

            let result;

            if (!isRoundTrip) {
                result = await transactionsService.createTransaction(
                    userData,
                    passengerData,
                    seatSelections,
                    planeId
                );
            } else {
                result = await transactionsService.createRoundTripTransaction(
                    userData,
                    passengerData,
                    seatSelections,
                    planeId,
                    returnSeatSelections,
                    returnPlaneId
                );
            }

            return res.status(201).json({
                message: isRoundTrip ? 'Round trip transaction created successfully' : 'Transaction created successfully',
                status: 201,
                data: result
            });

        } catch (error) {
            console.error('Create transaction error:', error);

            if (error.message === 'INVALID_USER_DATA') {
                return res.status(400).json({
                    message: 'Invalid user data provided',
                    status: 400
                });
            }

            if (error.message === 'INVALID_PASSENGER_DATA') {
                return res.status(400).json({
                    message: 'Invalid passenger data provided',
                    status: 400
                });
            }

            if (error.message === 'INVALID_SEAT_SELECTIONS') {
                return res.status(400).json({
                    message: 'Invalid seat selections provided',
                    status: 400
                });
            }

            if (error.message === 'INVALID_PLANE_ID') {
                return res.status(404).json({
                    message: 'Invalid plane ID provided',
                    status: 404
                });
            }

            if (error.message === 'PLANE_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Selected plane not found',
                    status: 404
                });
            }

            if (error.message === 'SEATS_UNAVAILABLE') {
                return res.status(409).json({
                    message: 'One or more selected seats are no longer available',
                    status: 409
                });
            }

            if (error.message === 'INVALID_RETURN_FLIGHT') {
                return res.status(400).json({
                    message: 'Invalid return flight details',
                    status: 400
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
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
                message: 'Transaction updated successfully',
                status: 200,
                data: updatedTransaction
            });
        } catch (error) {
            console.error('Update transaction error:', error);

            if (error.message === 'TRANSACTION_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Transaction not found',
                    status: 404
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
            });
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            const { transaction_id } = req.params;
            
            await transactionsService.deleteTransaction(parseInt(transaction_id));
            
            return res.status(200).json({
                message: 'Transaction deleted successfully',
                status: 200
            });
        } catch (error) {
            console.error('Delete transaction error:', error);

            if (error.message === 'TRANSACTION_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Transaction not found',
                    status: 404
                });
            }

            return res.status(500).json({
                message: 'Internal server error',
                status: 500
            });
        }
    }
};

module.exports = transactionsController;