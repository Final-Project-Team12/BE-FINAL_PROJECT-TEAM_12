const imagekit = require('../libs/imagekit');
const AirportService = require('../services/airportService');

class AirportController {
    static async uploadImageAirport(req, res, next) {
        try {
            if (!req.body.name || !req.body.airport_code || !req.body.continent_id) {
                return res.status(400).json({ 
                    status: 'Bad request',
                    statusCode: 400,
                    message: "Airport name, code, continent ID, and image must be provided." 
                });
            }

            if (!req.file) {
                return res.status(400).json({ 
                    status: 'Bad request',
                    statusCode: 400,
                    message: "Image file is required" 
                });
            }

            const stringFile = req.file.buffer.toString('base64');

            const uploadImage = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });

            const airportRecord = await AirportService.createAirport({
                name: req.body.name,
                address: req.body.address,
                airport_code: req.body.airport_code,
                image_url: uploadImage.url,
                file_id: uploadImage.fileId,
                continent_id: req.body.continent_id
            });

            res.status(201).json({
                status: 'success',
                message: 'Image successfully uploaded to airport',
                data: airportRecord
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAirports(req, res, next) {
        try {
            const airports = await AirportService.getAirports();

            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Airports retrieved successfully',
                data: airports
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAirportById(req, res, next) {
        const { airport_id } = req.params;
        try {
            const airport = await AirportService.getAirportById(airport_id);
            if (!airport) return res.status(404).json({ 
                status: 'not found',
                statusCode: 404,
                message: 'Airport not found' 
            });

            res.status(200).json(airport);
        } catch (error) {
            next(error);
        }
    }

    static async deleteAirport(req, res, next) {
        const { airport_id } = req.params;

        try {
            const airportToDelete = await AirportService.getAirportById(airport_id);

            if (!airportToDelete) {
                return res.status(404).json({
                    status: 'not found',
                    statusCode: 404,
                    message: 'Airport not found' 
                });
            }

            await imagekit.deleteFile(airportToDelete.file_id);

            await AirportService.deleteAirportById(airport_id);

            res.status(200).json({ message: 'Airport successfully deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async updateAirport(req, res, next) {
        const { airport_id } = req.params;
        const { name, airport_code, continent_id } = req.body;
        const file = req.file;

        try {
            const updateData = {
                ...(name && { name }),
                ...(airport_code && { airport_code }),
                ...(continent_id && { continent_id })
            };

            if (file) {
                const uploadResult = await imagekit.upload({
                    fileName: file.originalname,
                    file: file.buffer.toString('base64'),
                });
                updateData.image_url = uploadResult.url;
                updateData.file_id = uploadResult.fileId;
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ 
                    status: 'Bad request',
                    statusCode: 400,
                    message: 'No data provided for update' 
                });
            }

            const airport = await AirportService.updateAirportById(airport_id, updateData);

            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Airport successfully updated',
                data: airport,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AirportController;
