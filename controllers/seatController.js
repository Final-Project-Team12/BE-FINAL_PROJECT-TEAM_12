const seatService = require('../services/seatService');

class SeatController {
    static async createSeat(req, res, next) {
        try {
            const seatData = { ...req.body };
            const seat = await seatService.createSeat(seatData);
            res.status(201).json({
                status: 201,
                message: 'Seat created successfully',
                data: seat,
            });
         /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async getAllSeats(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 5;

            const { seats, totalPages } = await seatService.getAllSeats(page, limit);

            res.status(200).json({
                status: 200,
                message: 'Seats retrieved successfully',
                data: seats,
                pagination: {
                    currentPage: page,
                    limit: limit,
                    totalPages: totalPages,
                },
            });
         /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async getSeatById(req, res, next) {
        try {
            const { seat_id } = req.params;
            const seat = await seatService.getSeatById(parseInt(seat_id));

            if (!seat) {
                return res.status(404).json({
                    status: 404,
                    message: 'Seat not found',
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Seat retrieved successfully',
                data: seat,
            });
         /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async updateSeat(req, res, next) {
        try {
            const { seat_id } = req.params;
            const updateData = { ...req.body };

            const seat = await seatService.updateSeat(parseInt(seat_id), updateData);

            res.status(200).json({
                status: 200,
                message: 'Seat updated successfully',
                data: seat,
            });
         /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async deleteSeat(req, res, next) {
        try {
            const { seat_id } = req.params;
            const seat = await seatService.deleteSeat(parseInt(seat_id));

            res.status(200).json({
                status: 200,
                message: 'Seat deleted successfully',
            });
         /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
}

module.exports = SeatController;
