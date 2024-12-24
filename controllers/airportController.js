const imagekit = require('../libs/imagekit');
const AirportService = require('../services/airportService');

class AirportController {
    static async createAirport(req, res, next) {
        try {
            if (!req.body.name || !req.body.airport_code || !req.body.continent_id) {
                return res.status(400).json({
                    status: 400,
                    message: "Airport name, airport code, and continent ID must be provided."
                });
            }
        
            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    message: "Image file is required."
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
                continent_id: parseInt(req.body.continent_id)
            });
    
            res.status(201).json({
                status: 201,
                message: 'Airport successfully created and image uploaded.',
                data: airportRecord
            });
        }
        /* istanbul ignore test */
        catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
    
    static async getAirports(req, res, next) {
        try {
            const airports = await AirportService.getAirports();

            res.status(200).json({
                status: 200,
                message: 'List of airports successfully retrieved.',
                data: airports
            });
        } 
        /* istanbul ignore test */
        catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async getAirportById(req, res, next) {
        const { airport_id } = req.params;
        try {
            const airport = await AirportService.getAirportById(airport_id);
            if (!airport) {
                return res.status(404).json({
                    status: 404,
                    message: 'The requested airport was not found.'
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Airport details successfully retrieved.',
                data: airport
            });
        } 
        /* istanbul ignore test */
        catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async deleteAirport(req, res, next) {
        const { airport_id } = req.params;

        try {
            const airportToDelete = await AirportService.getAirportById(airport_id);

            if (!airportToDelete) {
                return res.status(404).json({
                    status: 404,
                    message: 'The airport to delete was not found.'
                });
            }

            await imagekit.deleteFile(airportToDelete.file_id);
            await AirportService.deleteAirportById(airport_id);

            res.status(200).json({ 
                status: 200,
                message: 'Airport successfully deleted.' 
            });
        } 
        /* istanbul ignore test */
        catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }

    static async updateAirport(req, res, next) {
        const { airport_id } = req.params;
        const { name, airport_code, continent_id } = req.body;
        const file = req.file;
    
        try {
            const airportToUpdate = await AirportService.getAirportById(airport_id);
    
            if (!airportToUpdate) {
                return res.status(404).json({
                    status: 404,
                    message: 'The airport to update was not found.'
                });
            }
    
            const updateData = {
                ...(name && { name }),
                ...(airport_code && { airport_code }),
                ...(continent_id && { continent_id: parseInt(continent_id, 10) }),
            };
    
            if (file) {
                const stringFile = file.buffer.toString('base64');
                // /* istanbul ignore next */
                // if (airportToUpdate.file_id) {
                //     await imagekit.deleteFile(airportToUpdate.file_id);
                // }
    
                const uploadResult = await imagekit.upload({
                    fileName: file.originalname,
                    file: stringFile,
                });
    
                updateData.image_url = uploadResult.url;
                updateData.file_id = uploadResult.fileId;
            }
    
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: 'No data provided for the update.'
                });
            }
    
            const updatedAirport = await AirportService.updateAirportById(airport_id, updateData);
    
            res.status(200).json({
                status: 200,
                message: 'Airport successfully updated.',
                data: updatedAirport,
            });
        } 
        /* istanbul ignore test */
        catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
}

module.exports = AirportController;
