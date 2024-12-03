const imagekit = require('../libs/imagekit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AirlineController {

    static async uploadImageAirlines(req, res) {
        try {
            if (!req.body.airline_name || !req.body.times_used) {
                return res.status(400).json({ message: "Airline name, times used, and image must all be provided." });
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
            console.error('Error during image upload:', error);
            res.status(500).json({ error: 'Failed to save airline data' });
        }
    }

    static async getAirlines(req, res) {
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
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve airlines',
                error: error.message
            });
        }
    }

    static async getAirlineById(req, res) {
        const { airline_id } = req.params;
        try {
            const airline = await prisma.airline.findUnique({
                where: { airline_id: parseInt(airline_id) }
            });
            if (!airline) return res.status(404).json({ message: 'Airline not found' });

            res.status(200).json(airline);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve airline details', error });
        }
    }

    static async deleteAirline(req, res) {
        const { airline_id } = req.params; 

        try {
            const airlineToDelete = await prisma.airline.findUnique({
                where: { airline_id: parseInt(airline_id) }
            });

            if (!airlineToDelete) {
                return res.status(404).json({ message: 'Airline not found' });
            }

            await imagekit.deleteFile(airlineToDelete.fileId); 

            await prisma.airline.delete({
                where: { airline_id: parseInt(airline_id) }
            });

            res.status(200).json({ message: 'Airline successfully deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete airline', error });
        }
    }

    static async updateAirline(req, res) {
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
            console.error(error);
            if (error.code === 'P2025') {
                return res.status(404).json({ message: 'Airline not found' });
            }
            res.status(500).json({ message: 'Failed to update airline', error });
        }
    }    
    
}

module.exports = AirlineController;
