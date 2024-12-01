require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const host = process.env.HOST;

const prisma = new PrismaClient();

class PaginationController{
    static getPagination(req, count, limit, page, url) {
        const pagination = {};
        const link = {};
        const path = `${req.protocol}://${host}${req.baseUrl}/${url}`;

        if(count - limit * page <= 0){
            link.next = "";
            if(page - 1 <= 0){
                link.prev = "0";
            }
            else{
                link.prev = `${path}?page=${page - 1}&limit=${limit}`;
            }
        }else {
            link.next = `${path}?page=${page + 1}&limit=${limit}`;
            if(page - 1 <= 0){
                link.prev = "";
            }
            else{
                link.prev = `${path}?page=${page - 1}&limit=${limit}`;
            }
        }

        pagination.links = link;
        pagination.totalItems = count;

        return pagination;
    }

    static async getPaginationTickets(req, res, next) {
        try{
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;

        const data = await prisma.seat.findMany({
            take: limit,
            skip: (page - 1)*limit,
            orderBy: {
                seat_id: 'asc'
            }
        })
        const count = await prisma.seat.count();
        let pagination = this.getPagination(req, count, limit, page, 'tickets')

        res.status(200).json({
            status: true,
            message: "success",
            page,
            limit, 
            count,
            data
        })
        }
        catch(err){
            next(err)
        }
    }
}

module.exports = PaginationController;