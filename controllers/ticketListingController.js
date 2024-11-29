const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TicketListingController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { filter, search } = req.query;

            if (filter === "favorite-airlines") {
                const [favoriteAirline] = await prisma.maskapai.findMany({
                    orderBy: {
                        times_used: 'desc'
                    },
                    take: 1
                });

                if (!favoriteAirline) {
                    return res.status(404).json({
                        message: "No favorite airline found",
                        data: [],
                    });
                }

                const flights = await prisma.pesawat.findMany({
                    where: {
                        maskapai: {
                            nama_maskapai: favoriteAirline.nama_maskapai
                        },
                        kursi: {
                            some: {} 
                        }
                    },
                    include: {
                        maskapai: true,
                        BandaraAsal: true,
                        BandaraTujuan: true,
                        kursi: true
                    },
                    orderBy: {
                        waktu_keberangkatan: "asc"
                    }
                });

                const sanitizedFlights = flights.map(flight => ({
                    id_pesawat: flight.id_pesawat,
                    kode_pesawat: flight.kode_pesawat,
                    waktu_keberangkatan: flight.waktu_keberangkatan,
                    waktu_kedatangan: flight.waktu_kedatangan,
                    bandara_asal: flight.BandaraAsal.nama_bandara,
                    bandara_tujuan: flight.BandaraTujuan.nama_bandara,
                    nama_maskapai: flight.maskapai.nama_maskapai,
                    available_seats: flight.kursi.length 
                }));

                return res.status(200).json({
                    message: "Available flights with seats fetched successfully",
                    data: sanitizedFlights,
                });
            }

            if (filter === "favorite-continent") {
                const [favoriteContinent] = await prisma.benua.findMany({
                    orderBy: {
                        bandara: {
                            _count: 'desc'
                        }
                    },
                    take: 1
                });

                if (!favoriteContinent) {
                    return res.status(404).json({
                        message: "No favorite continent found",
                        data: [],
                    });
                }

                const flights = await prisma.pesawat.findMany({
                    where: {
                        BandaraAsal: {
                            benua: {
                                nama_benua: favoriteContinent.nama_benua
                            }
                        },
                        kursi: {
                            some: {}
                        }
                    },
                    include: {
                        maskapai: true,
                        BandaraAsal: true,
                        BandaraTujuan: true,
                        kursi: true
                    },
                    orderBy: {
                        waktu_keberangkatan: "asc"
                    }
                });

                const sanitizedFlights = flights.map(flight => ({
                    id_pesawat: flight.id_pesawat,
                    kode_pesawat: flight.kode_pesawat,
                    waktu_keberangkatan: flight.waktu_keberangkatan,
                    waktu_kedatangan: flight.waktu_kedatangan,
                    bandara_asal: flight.BandaraAsal.nama_bandara,
                    bandara_tujuan: flight.BandaraTujuan.nama_bandara,
                    nama_maskapai: flight.maskapai.nama_maskapai,
                    available_seats: flight.kursi.length 
                }));

                return res.status(200).json({
                    message: "Available flights with seats fetched successfully",
                    data: sanitizedFlights,
                });
            }

            if (search) {
                const flights = await prisma.pesawat.findMany({
                    where: {
                        OR: [
                            {
                                kode_pesawat: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                maskapai: {
                                    nama_maskapai: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                BandaraAsal: {
                                    nama_bandara: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                BandaraTujuan: {
                                    nama_bandara: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            }
                        ],
                        kursi: {
                            some: {} 
                        }
                    },
                    include: {
                        maskapai: true,
                        BandaraAsal: true,
                        BandaraTujuan: true,
                        kursi: true
                    },
                    orderBy: {
                        waktu_keberangkatan: "asc"
                    }
                });

                const sanitizedFlights = flights.map(flight => ({
                    id_pesawat: flight.id_pesawat,
                    kode_pesawat: flight.kode_pesawat,
                    waktu_keberangkatan: flight.waktu_keberangkatan,
                    waktu_kedatangan: flight.waktu_kedatangan,
                    bandara_asal: flight.BandaraAsal.nama_bandara,
                    bandara_tujuan: flight.BandaraTujuan.nama_bandara,
                    nama_maskapai: flight.maskapai.nama_maskapai,
                    available_seats: flight.kursi.length 
                }));

                return res.status(200).json({
                    message: "Search results fetched successfully",
                    data: sanitizedFlights,
                });
            }

            return res.status(400).json({
                message: "Invalid filter or search query",
                data: [],
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TicketListingController;
