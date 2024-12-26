const seatService = require('../services/seatService');

class SeatController {
    static async createSeat(req, res, next) {
        try {
            const seatData = { ...req.body }; // Menggunakan spread operator
            const seat = await seatService.createSeat(seatData);
            res.status(201).json(seat);
        } catch (error) {
            next(error);
        }
    }

    static async getAllSeats(req, res, next) {
        try {
            const seats = await seatService.getAllSeats();
            res.status(200).json(seats);
        } catch (error) {
            next(error);
        }
    }

    static async getSeatById(req, res, next) {
        try {
            const { seat_id } = req.params;
            const seat = await seatService.getSeatById(parseInt(seat_id));
            if (!seat) {
                return res.status(404).json({ message: 'Seat not found' });
            }
            res.status(200).json(seat);
        } catch (error) {
            next(error);
        }
    }

    static async updateSeat(req, res, next) {
        try {
            const { seat_id } = req.params;
            const updateData = { ...req.body }; // Menggunakan spread operator
            const seat = await seatService.updateSeat(parseInt(seat_id), updateData);
            res.status(200).json(seat);
        } catch (error) {
            next(error);
        }
    }

    static async deleteSeat(req, res, next) {
        try {
            const { seat_id } = req.params;
            await seatService.deleteSeat(parseInt(seat_id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SeatController;
