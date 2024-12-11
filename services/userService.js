const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    let userData = await prisma.users.update({
        where: { email },
        data
    });

    return userData;
}

async function updateUserById(user_id, data){
    let userData = await prisma.users.update({
        where: { user_id },
        data
    });

    return userData;
}

async function updateUserByEmail(email, data){
    const userData = await prisma.users.update({
        where: {email},
        data
    })

    return userData;
}

async function deleteUserById(user_id){
    const deletedUser = await prisma.users.delete({
        where: {
            user_id
        }
    }) 
    
    return deletedUser;
}

async function checkOtherEmail(checkEmail){
    const check = await prisma.users.count({
        where: {email : checkEmail}
    })
    console.log(checkEmail);
    if(check >= 1){
        return true
    }
    else{
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