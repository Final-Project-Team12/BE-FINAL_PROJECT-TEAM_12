const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getUserById, getUserByEmail } = require("../services/userService");

let JWT_SECRET = process.env.JWT_SECRET;

class RestrictJwtAdmin{
    static async restrict(req, res, next) {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: "You are not authorized",
            });
        }

        const token = authorization.split(' ')[1];

        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            const userData = await getUserByEmail(decoded.user_email)
            if (!userData) {
                return res.status(401).json({
                    status: 401,
                    message: "User not found",
                });
            }

            if(!(userData.role == 'admin' || userData.role == 'Admin')) {
                res.status(401).json({
                    status: 401,
                    message: "You are not authorized",
                });
            }

            req.user = userData;
            next();
        } catch (err) {
            res.status(401).json({
                status: 401,
                message: "You are not authorized",
            });
        }
    };

}

module.exports = RestrictJwtAdmin.restrict;