const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPlane(data) {
    return await prisma.plane.create({
        data: { ...data },
    });
}

async function getAllPlanes(page, limit) {
    const offset = (page - 1) * limit;
    const totalPlanes = await prisma.plane.count();
    const totalPages = Math.ceil(totalPlanes / limit);

    const planes = await prisma.plane.findMany({
        skip: offset,
        take: limit,
        include: {
            airline: true,
            origin_airport: true,
            destination_airport: true,
        },
    });

    return {
        planes,
        totalPages,
    };
}


async function getPlaneById(plane_id) {
    return await prisma.plane.findUnique({
        where: { plane_id: parseInt(plane_id) },
        include: {
            airline: true,
            origin_airport: true,
            destination_airport: true,
        },
    });
}

async function updatePlane(plane_id, data) {
    return await prisma.plane.update({
        where: { plane_id: parseInt(plane_id) },
        data: { ...data },
    });
}

async function deletePlane(plane_id) {
    return await prisma.plane.delete({
        where: { plane_id: parseInt(plane_id) },
    });
}

module.exports = {
    createPlane,
    getAllPlanes,
    getPlaneById,
    updatePlane,
    deletePlane,
};
