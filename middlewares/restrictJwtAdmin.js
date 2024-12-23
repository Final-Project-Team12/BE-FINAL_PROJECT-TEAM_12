const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getUserById, getUserByEmail } = require("../services/userService");

let JWT_SECRET = process.env.JWT_SECRET;

class RestrictJwtAdmin{
    static async restrict(req, res, next) {
        const { authorization } = req.headers;
        /* istanbul ignore next */
        if (!authorization || !authorization.startsWith('Bearer ')) {
            /* istanbul ignore next */
            return res.status(401).json({
                status: 401,
                message: "You are not authorized",
            });
        }

        const token = authorization.split(' ')[1];

        try {
            const decoded = await new Promise((resolve, reject) => {
                /* istanbul ignore next */
                jwt.verify(token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        /* istanbul ignore next */
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            const userData = await getUserByEmail(decoded.email)
            /* istanbul ignore next */
            if (!userData) {
                /* istanbul ignore next */
                return res.status(401).json({
                    status: 401,
                    message: "User not found",
                });
            }

            if(!(userData.role == 'admin' || userData.role == 'Admin')) {
                /* istanbul ignore next */
                res.status(401).json({
                    status: 401,
                    message: "You are not authorized",
                });
            }

            req.user = userData;
            next();
        } catch (err) {
            /* istanbul ignore next */
            res.status(401).json({
                status: 401,
                message: "You are not authorized",
            });
        }
    };

}

module.exports = RestrictJwtAdmin.restrict;