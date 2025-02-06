
const express = require('express');
const { Op } = require('sequelize');

const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');
const { validateBooking } = require('../../utils/validators.js');

const router = express.Router();

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  if (user) {
    const bookings = await Booking.scope({
      method: ['byUserId', user.id],
    }).findAll({
      include: [
        {
          model: Spot,
          attributes: {
            exclude: ['description', 'createdAt', 'updatedAt'],
          },
          include: [
            {
              model: SpotImage,
              preview: true,
              attributes: ['url'],
            },
          ],
        },
      ],
    });

    const formattedBookings = bookings.map(booking => ({
      ...booking.toJSON(),
      Spot: { ...booking.Spot.toJSON(), previewImage: '' },
    }));

    const safeBookings = [];

    formattedBookings.forEach(booking => {
      booking.Spot.previewImage = booking.Spot.SpotImages[0]
        ? booking.Spot.SpotImages[0].url
        : null;
      delete booking.Spot.SpotImages;

      safeBookings.push({
        id: booking.id,
        spotId: booking.spotId,
        Spot: booking.Spot,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      });
    });

    return res.json({ Bookings: safeBookings });
  } else {
    return res.json({ user: null });
  }
});

// Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      const userId = user.id;

      try {
        if (userId !== booking.userId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      try {
        if (booking.endDate <= new Date()) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 400;
        return res.json({ message: "Past bookings can't be modified" });
      }

      try {
        const spotId = booking.spotId;
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        const allBookings = await Booking.scope({
          method: ['bySpotId', spotId],
        }).findAll({
          where: {
            userId: {
              [Op.not]: userId,
            },
          },
        });

        allBookings.forEach(booking => {
          if (booking.startDate >= startDate && booking.endDate <= endDate) {
            throw new Error();
          } else if (
            booking.startDate >= startDate &&
            booking.startDate <= endDate
          ) {
            throw new Error();
          } else if (
            booking.endDate >= startDate &&
            booking.endDate <= endDate
          ) {
            throw new Error();
          }
        });

        booking.startDate = startDate;
        booking.endDate = endDate;

        await booking.save();
        return res.json(booking);
      } catch (error) {
        res.statusCode = 403;
        return res.json({
          message: 'Sorry, this spot is already booked for the specified dates',
          errors: {
            startDate: 'Start date conflicts with an existing booking',
            endDate: 'End date conflicts with an existing booking',
          },
        });
      }
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Booking couldn't be found" });
  }
});

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== booking.userId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      try {
        if (booking.startDate <= new Date()) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 400;
        return res.json({
          message: "Bookings that have been started can't be deleted",
        });
      }

      await booking.destroy();
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Booking couldn't be found" });
  }
});

module.exports = router;