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
      /* istanbul ignore next */

        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        reject(err);
                              /* istanbul ignore next */

                    } else {
                              /* istanbul ignore next */

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
      /* istanbul ignore next */

            if(!(userData.role == 'admin' || userData.role == 'Admin')) {
                      /* istanbul ignore next */

                res.status(401).json({
                    status: 401,
                    message: "You are not authorized",
                });
            }

            req.user = userData;
            next();
                  /* istanbul ignore next */

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