const prisma = require('../prisma/client');

async function createUser(data){
    const newUser = await prisma.users.create({
        data
    });

    return newUser;
}

async function getUserByEmail(email){
    const userData = await prisma.users.findUnique({
        where: {
            email
        }
    })

    return userData
}

async function getUserById(user_id){
    const userData = await prisma.users.findUnique({
        where: {
            user_id
        }
    })
    
    return userData
}

async function updateUserByEmail(email, data){
    const userData = await prisma.users.update({
        where: {email},
        data
    })

    return userData;
}

async function updateUserById(user_id, data){
    let userData = await prisma.users.update({
        where: { user_id },
        data
    });

    return userData;
}

async function deleteUserById(user_id) {
    await prisma.notification.deleteMany({
        where: {
            user_id: user_id
        }
    });
    await prisma.transaction.deleteMany({
        where: {
            user_id: user_id
        }
    });
    const deletedUser = await prisma.users.delete({
        where: {
            user_id: user_id
        }
    });
    
    return deletedUser;
}

async function checkOtherEmail(checkEmail){
    /* istanbul ignore next */
    const check = await prisma.users.count({
        where: {email : checkEmail}
    })
    /* istanbul ignore next */
    if(check >= 1){
        /* istanbul ignore next */
        return true
    }
    /* istanbul ignore next */
    else{
        /* istanbul ignore next */
        return false
    }
}

module.exports = {
    getUserByEmail,
    updateUserByEmail,
    createUser,
    updateUserByEmail,
    getUserById,
    updateUserById,
    deleteUserById,
    checkOtherEmail
}