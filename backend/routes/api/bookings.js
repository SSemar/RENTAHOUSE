const express = require('express');
const { Booking, Spot, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth.js');
const router = express.Router();

//! GET all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.findAll({
            where: { userId },
            include: {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: {
                    model: SpotImage,
                    as: 'SpotImages',
                    where: { preview: true },
                    attributes: ['url'],
                    required: false,
                },
            },
        });

        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            spotId: booking.spotId,
            Spot: {
                ...booking.Spot.toJSON(),
                previewImage: booking.Spot.SpotImages?.[0]?.url || null,
            },
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        }));

        return res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        next(error);
    }
});

//! GET all Bookings for a Spot based on the Spot's id
router.get('/spots/:spotId/bookings', requireAuth, async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const isOwner = spot.ownerId === req.user.id;

        const bookings = await Booking.findAll({
            where: { spotId },
            include: isOwner
                ? {
                      model: User,
                      attributes: ['id', 'firstName', 'lastName'],
                  }
                : null,
        });

        const formattedBookings = bookings.map(booking => {
            if (isOwner) {
                return {
                    User: booking.User,
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt,
                };
            } else {
                return {
                    spotId: booking.spotId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                };
            }
        });

        return res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        next(error);
    }
});

//! POST Create a Booking from a Spot based on the Spot's id
router.post('/spots/:spotId/bookings', requireAuth, async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const { startDate, endDate } = req.body;
        const userId = req.user.id;

        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId === userId) {
            return res.status(403).json({
                message: "Cannot book your own spot",
            });
        }

        const existingBookings = await Booking.findAll({
            where: {
                spotId,
                [Op.or]: [
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                ],
            },
        });

        if (existingBookings.length > 0) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate,
        });

        return res.status(201).json(newBooking);
    } catch (error) {
        next(error);
    }
});

//! PUT Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { startDate, endDate } = req.body;
        const userId = req.user.id;

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this booking" });
        }

        if (new Date() > new Date(booking.endDate)) {
            return res.status(403).json({
                message: "Past bookings can't be modified",
            });
        }

        const existingBookings = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                id: { [Op.ne]: booking.id },
                [Op.or]: [
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                ],
            },
        });

        if (existingBookings.length > 0) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        booking.startDate = startDate;
        booking.endDate = endDate;
        await booking.save();

        return res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
});

//! DELETE a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        const spot = await Spot.findByPk(booking.spotId);
        const isOwner = spot && spot.ownerId === userId;

        if (booking.userId !== userId && !isOwner) {
            return res.status(403).json({ message: "Not authorized to delete this booking" });
        }

        if (new Date() >= new Date(booking.startDate)) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted",
            });
        }

        await booking.destroy();

        return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
