const imagekit = require('../libs/imagekit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AirlineController {

    static async uploadImageAirlines(req, res, next){
        try {
            if (!req.body.airline_name || !req.body.times_used) {
                return res.status(400).json({
                    status: "bad request",
                    message: "Airline name, times used, and image must all be provided." });
            }

            const stringFile = req.file.buffer.toString('base64');

            const uploadImage = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });

            const airlineRecord = await prisma.airline.create({
                data: {
                    airline_name: req.body.airline_name,
                    times_used: parseInt(req.body.times_used, 10),                    
                    image_url: uploadImage.url,
                    file_id: uploadImage.fileId
                }
            });
            res.status(201).json({
                status: 'success',
                message: 'Image successfully uploaded to airline',
                data: airlineRecord
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAirlines(req, res, next) {
        try {
            const airlines = await prisma.airline.findMany({
                select: {
                    airline_id: true,
                    airline_name: true,
                    image_url: true,
                    times_used: true
                }
            });

            res.status(200).json({
                status: 'success',
                message: 'Airlines retrieved successfully',
                data: airlines
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAirlineById(req, res, next) {
        const { airline_id } = req.params;
        try {
            const airline = await prisma.airline.findUnique({
                where: { airline_id: parseInt(airline_id) }
            });
            if (!airline) return res.status(404).json({ 
                status: 'not found',
                message: 'Airline not found' 
            });

            res.status(200).json(airline);
        } catch (error) {
            next(error);
        }
    }

    static async deleteAirline(req, res, next) {
        const { airline_id } = req.params; 

        try {
            const airlineToDelete = await prisma.airline.findUnique({
                where: { airline_id: parseInt(airline_id) }
            });

            if (!airlineToDelete) {
                return res.status(404).json({ 
                    status: 'not found',
                    message: 'Airline not found' 
                });
            }

            await imagekit.deleteFile(airlineToDelete.fileId); 

            await prisma.airline.delete({
                where: { airline_id: parseInt(airline_id) }
            });

            res.status(200).json({ 
                status: 'success',
                message: 'Airline successfully deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async updateAirline(req, res, next) {
        const { airline_id } = req.params;
        const { airline_name, times_used } = req.body;
        const file = req.file;
    
        try {
            const updateData = {
                ...(airline_name && { airline_name }),
                ...(times_used && { times_used: parseInt(times_used) }),
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
                return res.status(400).json({ message: 'No data provided for update' });
            }
    
            const airline = await prisma.airline.update({
                where: { airline_id: parseInt(airline_id) },
                data: updateData,
            });
    
            res.status(200).json({
                status: 'success',
                message: 'Airline successfully updated',
                data: airline,
            });
        } catch (error) {
            next(error);
        }
    }    
    
}

module.exports = AirlineController;
