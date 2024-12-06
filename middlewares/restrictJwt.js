const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            status: "Unauthorized",
            statusCode: 401,
            message: "You are not authorized",
        });
    }

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(authorization, JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        const userData = await prisma.users.findUnique({
            where: {
                user_id: decoded.user_id,
            },
        });

        if (!userData) {
            return res.status(401).json({
                status: "Unauthorized",
                statusCode: 401,
                message: "User not found",
            });
        }

        req.user = userData;
        next();
    } catch (err) {
        res.status(401).json({
            status: "Unauthorized",
            statusCode: 401,
            message: "You are not authorized",
        });
    }
};
