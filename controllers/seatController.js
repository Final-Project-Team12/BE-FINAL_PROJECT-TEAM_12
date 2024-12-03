require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const host = process.env.HOST;

const prisma = new PrismaClient();

class TicketController{
    static async getSeat(req, res, next, seat_id){
        try{
            let seat = await prisma.seat.findMany()
            if(seat){
                return res.status(200).json({
                    status: true,
                    message: "success",
                    data: seat
                })
            }
            else{
                return res.status(404).json({
                    status: false,
                    message: "Seats do not exist"
                })
            }
        }
        catch(error){
            next(error)
        }
    }
    static async getSeatById(req, res, next, seat_id){
        try{
            let seat = await prisma.seat.findUnique({
                where: {
                    seat_id : parseInt(seat_id)
                }
            })
            if(seat){
                return res.status(200).json({
                    status: true,
                    message: "success",
                    data: seat
                })
            }
            else{
                return res.status(404).json({
                    status: false,
                    message: "Seat not found"
                })
            }
        }
        catch(error){
            next(error)
        }
    }
}

module.exports = TicketController;