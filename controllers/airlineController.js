const AirlineService = require('../services/airlineService');

class AirlineController {
    static async uploadImageAirlines(req, res, next) {
        try {
            if (!req.body.airline_name || !req.file) {
                return res.status(400).json({
                    status: 400,
                    message: "Airline name, times used, and image must all be provided."
                });
            }

            const uploadImage = await AirlineService.uploadImage(req.file);

            const airlineRecord = await AirlineService.createAirline({
                airline_name: req.body.airline_name,
                image_url: uploadImage.url,
                file_id: uploadImage.fileId
            });

            res.status(201).json({
                status: 201,
                message: 'Image successfully uploaded to airline',
                data: airlineRecord
            });
        /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async getAirlines(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
    
            const { airlines, totalPages } = await AirlineService.getAllAirlines(page, limit);
    
            res.status(200).json({
                status: 200,
                message: 'Airlines retrieved successfully',
                data: airlines,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit,
                },
            });
            /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
    
    static async getAirlineById(req, res, next) {
        const { airline_id } = req.params;
        try {
            const airline = await AirlineService.getAirlineById(airline_id);
            if (!airline) {
                return res.status(404).json({
                    status: 404,
                    message: 'Airline not found'
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Airline retrieved successfully',
                data: airline
            });
        /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async deleteAirline(req, res, next) {
        const { airline_id } = req.params;
        try {
            const airlineToDelete = await AirlineService.getAirlineById(airline_id);

            if (!airlineToDelete) {
                return res.status(404).json({
                    status: 404,
                    message: 'Airline not found'
                });
            }

            await AirlineService.deleteImage(airlineToDelete.file_id);
            await AirlineService.deleteAirline(airline_id);

            res.status(200).json({
                status: 200,
                message: 'Airline successfully deleted'
            });
            /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async updateAirline(req, res, next) {
        const { airline_id } = req.params;
        const { airline_name, times_used } = req.body;
        const file = req.file;

        try {
            const airlineToUpdate = await AirlineService.getAirlineById(airline_id);
            if (!airlineToUpdate) {
                return res.status(404).json({
                    status: 404,
                    message: 'Airline not found'
                });
            }

            const updateData = {
                ...(airline_name && { airline_name }),
                ...(times_used && { times_used: parseInt(times_used) })
            };

            if (file) {
                await AirlineService.deleteImage(airlineToUpdate.file_id);

                const uploadResult = await AirlineService.uploadImage(file);
                updateData.image_url = uploadResult.url;
                updateData.file_id = uploadResult.fileId;
            }

            const updatedAirline = await AirlineService.updateAirline(airline_id, updateData);

            res.status(200).json({
                status: 200,
                message: 'Airline successfully updated',
                data: updatedAirline
            });
        /* istanbul ignore next */
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
}

module.exports = AirlineController;
