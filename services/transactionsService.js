const prisma = require('../prisma/client');

exports.getAllTransactions = async () => {
  try {
    return await prisma.transaction.findMany({
      include: { tickets: true }
    });
  } catch (error) {
    throw new Error(`Failed to retrieve transactions: ${error.message}`);
  }
};

exports.createTransaction = async (data) => {
  if (!data.user_id || !data.total_payment || !data.status) {
    throw new Error('Transaction data is incomplete.');
  }

  try {
    const userExists = await prisma.users.findUnique({
      where: { user_id: data.user_id }
    });

    if (!userExists) {
      throw new Error('User with that ID was not found.');
    }

    return await prisma.transaction.create({
      data: {
        status: data.status,
        redirect_url: data.redirect_url || null,
        transaction_date: new Date(),
        token: data.token || null,
        message: data.message || null,
        total_payment: data.total_payment,
        user_id: data.user_id
      }
    });
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

exports.updateTransaction = async (transaction_id, data) => {
  if (!transaction_id || !data) {
    throw new Error('Invalid transaction ID or data.');
  }

  try {
    const transactionExists = await prisma.transaction.findUnique({
      where: { transaction_id: parseInt(transaction_id) }
    });

    if (!transactionExists) {
      throw new Error('Transaction with that ID was not found.');
    }
    return await prisma.transaction.update({
      where: { transaction_id: parseInt(transaction_id) },
      data,
    });
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
};

exports.deleteTransaction = async (transaction_id) => {
  if (!transaction_id) {
    throw new Error('Invalid transaction ID.');
  }

  try {
    const transactionExists = await prisma.transaction.findUnique({
      where: { transaction_id: parseInt(transaction_id) }
    });

    if (!transactionExists) {
      throw new Error('Transaction with that ID was not found.');
    }
    return await prisma.transaction.delete({
      where: { transaction_id: parseInt(transaction_id) }
    });
  } catch (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
};