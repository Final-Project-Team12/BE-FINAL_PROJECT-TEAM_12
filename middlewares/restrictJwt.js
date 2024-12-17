const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getUserById } = require("../services/userService");

let JWT_SECRET = process.env.JWT_SECRET;

class RestrictJwt{
    static async restrict(req, res, next) {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                status: "unauthorized",
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

            const userData = await getUserById(decoded.user_id)

            if (!userData) {
                return res.status(401).json({
                    status: "unauthorized",
                    message: "User not found",
                });
            }

            req.user = userData;
            next();
        } catch (err) {
            res.status(401).json({
                status: "unauthorized",
                message: "You are not authorized",
            });
        }
    };

}

module.exports = RestrictJwt.restrict;