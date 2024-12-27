const planeService = require('../services/planeService');

class PlaneController {
    static async createPlaneController(req, res, next) {
        try {
            const data = { ...req.body };
            const newPlane = await planeService.createPlane(data);
            res.status(201).json({
                status: 201,
                message: 'Plane created successfully',
                data: newPlane,
            });
            /* istanbul ignore test */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async getAllPlanesController(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 5;
    
            const { planes, totalPages } = await AirlineService.getAllAirlines(page, limit);
    
            res.status(200).json({
                status: 200,
                message: 'All planes fetched successfully',
                data: planes,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit,
                },
            });
            /* istanbul ignore test */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async getPlaneByIdController(req, res, next) {
        try {
            const plane_id = parseInt(req.params.plane_id);
            const plane = await planeService.getPlaneById(plane_id);
            if (!plane) {
                return res.status(404).json({
                    status: 404,
                    message: 'Plane not found',
                });
            }
            res.status(200).json({
                status: 200,
                message: 'Plane fetched successfully',
                data: plane,
                });
            /* istanbul ignore test */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async updatePlaneController(req, res, next) {
        try {
            const plane_id = parseInt(req.params.plane_id);
            const data = { ...req.body };
            const updatedPlane = await planeService.updatePlane(plane_id, data);
            res.status(200).json({
                status: 200,
                message: 'Plane updated successfully',
                data: updatedPlane,
            });
            /* istanbul ignore test */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async deletePlaneController(req, res, next) {
        try {
            const plane_id = parseInt(req.params.plane_id);
            const deletedPlane = await planeService.deletePlane(plane_id);
    
            res.status(200).json({
                status: 200,
                message: 'Plane deleted successfully',
                data: deletedPlane,
            });
            /* istanbul ignore test */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
    
    
}

module.exports = PlaneController;
