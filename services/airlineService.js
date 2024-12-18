const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../libs/imagekit');

class AirlineService {
    static async uploadImage(file) {
        const stringFile = file.buffer.toString('base64');
        const uploadImage = await imagekit.upload({
            fileName: file.originalname,
            file: stringFile
        });
        return uploadImage;
    }

    static async createAirline(data) {
        return prisma.airline.create({ data });
    }

    static async getAllAirlines() {
        return prisma.airline.findMany({
            select: {
                airline_id: true,
                airline_name: true,
                image_url: true,
                times_used: true
            }
        });
    }

    static async getAirlineById(airline_id) {
        return prisma.airline.findUnique({
            where: { airline_id: parseInt(airline_id) }
        });
    }

    static async deleteAirline(airline_id) {
        return prisma.airline.delete({
            where: { airline_id: parseInt(airline_id) }
        });
    }

    static async updateAirline(airline_id, updateData) {
        return prisma.airline.update({
            where: { airline_id: parseInt(airline_id) },
            data: updateData
        });
    }

    static async deleteImage(fileId) {
        return imagekit.deleteFile(fileId);
    }
}

module.exports = AirlineService;
