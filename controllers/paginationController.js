require("dotenv").config();
const host = process.env.HOST;

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
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;

        let pagination = this.getPagination(req, count, limit, page, 'tickets')

        res.json({
            data: pagination
        })
    }
}

module.exports = PaginationController;