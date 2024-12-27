const transactionsService = require("../services/transactionsService");
const ERROR_CODES = {
  CONCURRENCY_ERROR: 'P2002'
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const transactionsController = {
  getTransactionsByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;
      const transactions = await transactionsService.getTransactionsByUserId(
        parseInt(user_id)
      );

      const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (transaction.trip_type === "single") {
          acc.push({
            type: "single",
            transaction: transaction
          });
        } else {
          const existingGroup = acc.find(
            group => 
              group.outbound?.transaction_id === transaction.related_transaction_id ||
              group.return?.transaction_id === transaction.related_transaction_id
          );

          if (existingGroup) {
            if (transaction.trip_type === "outbound") {
              existingGroup.outbound = transaction;
            } else {
              existingGroup.return = transaction;
            }
          } else {
            const newGroup = { type: "round" };
            if (transaction.trip_type === "outbound") {
              newGroup.outbound = transaction;
            } else {
              newGroup.return = transaction;
            }
            acc.push(newGroup);
          }
        }
        return acc;
      }, []);

      return res.status(200).json({
        message: "Transactions retrieved successfully",
        status: 200,
        data: groupedTransactions,
      });
    } catch (error) {
      /* istanbul ignore next */
      console.error("Get transactions by user ID error:", error);
      /* istanbul ignore next */
      return handleControllerError(error, res);
    }
  },

  createTransaction: async (req, res) => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const {
          userData,
          passengerData,
          seatSelections,
          planeId,
          isRoundTrip,
          returnPlaneId,
          returnSeatSelections,
        } = req.body;

        if (isRoundTrip && (!returnPlaneId || !returnSeatSelections)) {
          return res.status(400).json({
            message: "Return flight details are required for round trip",
            status: 400,
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

          return res.status(201).json({
            message: "Transaction created successfully",
            status: 201,
            data: {
              type: "single",
              transaction: result
            },
          });
        } else {
          result = await transactionsService.createRoundTripTransaction(
            userData,
            passengerData,
            seatSelections,
            planeId,
            returnSeatSelections,
            returnPlaneId
          );

          return res.status(201).json({
            message: "Round trip transaction created successfully",
            status: 201,
            data: {
              type: "round",
              outbound: result.outbound,
              return: result.return,
              total_payment: result.outbound.total_payment + result.return.total_payment
            },
          });
        }
      } catch (error) {
        /* istanbul ignore next */
        if (error.code === ERROR_CODES.CONCURRENCY_ERROR && retries < MAX_RETRIES - 1) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        console.error("Create transaction error:", error);
        return handleControllerError(error, res);
      }
    }
  },

  updateTransaction: async (req, res) => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const { transaction_id } = req.params;
        const updateData = req.body;

        const updatedTransaction = await transactionsService.updateTransaction(
          parseInt(transaction_id),
          updateData
        );

        return res.status(200).json({
          message: "Transaction updated successfully",
          status: 200,
          data: updatedTransaction,
        });
      } catch (error) {
        /* istanbul ignore next */
        if (error.code === ERROR_CODES.CONCURRENCY_ERROR && retries < MAX_RETRIES - 1) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        /* istanbul ignore next */
        console.error("Update transaction error:", error);
        /* istanbul ignore next */
        return handleControllerError(error, res);
      }
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { transaction_id } = req.params;
      await transactionsService.deleteTransaction(parseInt(transaction_id));

      return res.status(200).json({
        message: "Transaction deleted successfully",
        status: 200,
      });
    } catch (error) {
      console.error("Delete transaction error:", error);
      return handleControllerError(error, res);
    }
  },
};

function handleControllerError(error, res) {
  const errorMapping = {
    TRANSACTIONS_NOT_FOUND: { status: 404, message: "Transactions not found for this user" },
    TRANSACTION_NOT_FOUND: { status: 404, message: "Transaction not found" },
    INVALID_USER_DATA: { status: 400, message: "Invalid user data provided" },
    INVALID_PASSENGER_DATA: { status: 400, message: "Invalid passenger data provided" },
    INVALID_SEAT_SELECTIONS: { status: 400, message: "Invalid seat selections provided" },
    INVALID_PLANE_ID: { status: 404, message: "Invalid plane ID provided" },
    PLANE_NOT_FOUND: { status: 404, message: "Selected plane not found" },
    SEATS_UNAVAILABLE: { status: 409, message: "One or more selected seats are no longer available" },
    INVALID_RETURN_FLIGHT: { status: 400, message: "Invalid return flight details" },
    /* istanbul ignore next */
    CONCURRENCY_ERROR: { status: 409, message: "Please try again, concurrent update detected" }
  };

  const errorResponse = errorMapping[error.message] || {
    status: 500,
    message: "Internal server error"
  };

  return res.status(errorResponse.status).json({
    message: errorResponse.message,
    status: errorResponse.status,
  });
}

module.exports = transactionsController;