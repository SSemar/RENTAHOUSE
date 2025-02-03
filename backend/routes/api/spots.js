
const express = require('express');

const {
  Booking,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
  User,
} = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');
const {
  validateSpot,
  validateReview,
  validateBooking,
  validateQuery,
} = require('../../utils/validators.js');

const router = express.Router();

//! Get all Spots
router.get('/', validateQuery, async (req, res) => {
  const scopes = [];
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  if (page && size) {
    scopes.push({ method: ['page', page, size] }, { method: ['size', size] });
  } else if (page) {
    scopes.push({ method: ['page', page] });
  } else if (size) {
    scopes.push({ method: ['size', size] });
  }
  if (minLat) scopes.push({ method: ['minLat', minLat] });
  if (maxLat) scopes.push({ method: ['maxLat', maxLat] });
  if (minLng) scopes.push({ method: ['minLng', minLng] });
  if (maxLng) scopes.push({ method: ['maxLng', maxLng] });
  if (minPrice) scopes.push({ method: ['minPrice', minPrice] });
  if (maxPrice) scopes.push({ method: ['maxPrice', maxPrice] });

  const allSpots = await Spot.scope(...scopes).findAll({
    include: [
      {
        model: Review,
        attributes: ['stars'],
      },
      {
        model: SpotImage,
        attributes: ['preview', 'url'],
      },
    ],
  });

  const formattedSpots = allSpots.map(spot => ({
    ...spot.toJSON(),
    avgRating: '',
    previewImage: '',
  }));

  formattedSpots.forEach(spot => {
    spot.lat = parseFloat(spot.lat);
    spot.lng = parseFloat(spot.lng);
    spot.price = parseFloat(spot.price);

    const reviewsSum = spot.Reviews.reduce((acc, curr) => acc + curr.stars, 0);
    const avgRating = reviewsSum / spot.Reviews.length;
    spot.avgRating = avgRating;
    delete spot.Reviews;

    const foundImage = spot.SpotImages.find(
      spotImage => spotImage.preview === true
    );
    spot.previewImage = foundImage ? foundImage.url : null;
    delete spot.SpotImages;
  });

  const response = { Spots: formattedSpots };
  if (scopes) {
    response.page = page ? page : 1;
    response.size = size ? size : 20;
  }

  return res.json(response);
});

//! Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  if (user) {
    const allSpots = await Spot.scope({
      method: ['byOwnerId', user.id],
    }).findAll({
      include: [
        {
          model: Review,
          attributes: ['stars'],
        },
        {
          model: SpotImage,
          preview: true,
          attributes: ['url'],
        },
      ],
    });

    const formattedSpots = allSpots.map(spot => ({
      ...spot.toJSON(),
      avgRating: '',
      previewImage: '',
    }));

    formattedSpots.forEach(spot => {
      const reviewsSum = spot.Reviews.reduce(
        (acc, curr) => acc + curr.stars,
        0
      );
      const avgRating = reviewsSum / spot.Reviews.length;
      spot.avgRating = avgRating;
      delete spot.Reviews;

      spot.previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;
      delete spot.SpotImages;
    });

    return res.json({ Spots: formattedSpots });
  } else {
    return res.json({ user: null });
  }
});

//! Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: Review,
          attributes: ['stars'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    const formattedSpot = {
      ...spot.toJSON(),
      numReviews: '',
      avgStarRating: '',
      SpotImages: [],
      Owner: spot.User,
    };

    const reviewsSum = formattedSpot.Reviews.reduce(
      (acc, curr) => acc + curr.stars,
      0
    );
    const avgStarRating = reviewsSum / formattedSpot.Reviews.length;
    formattedSpot.numReviews = formattedSpot.Reviews.length;
    formattedSpot.avgStarRating = avgStarRating;
    delete formattedSpot.Reviews;

    formattedSpot.SpotImages = await SpotImage.scope('defaultScope', {
      method: ['bySpotId', spotId],
    }).findAll();

    formattedSpot.Owner = formattedSpot.User;
    delete formattedSpot.User;

    return res.json({ ...formattedSpot });
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot couldn't be found" });
  }
});

//! Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  if (user) {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const ownerId = user.id;

    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.statusCode = 201;
    return res.json(spot);
  } else {
    return res.json({ user: null });
  }
});

//! Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== spot.ownerId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      const { url, preview } = req.body;

      const spotImage = await SpotImage.create({
        spotId,
        url,
        preview,
      });

      const safeSpotImage = {
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview,
      };

      res.statusCode = 201;
      return res.json(safeSpotImage);
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot couldn't be found" });
  }
});

//! Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== spot.ownerId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      } = req.body;

      spot.address = address;
      spot.city = city;
      spot.state = state;
      spot.country = country;
      spot.lat = lat;
      spot.lng = lng;
      spot.name = name;
      spot.description = description;
      spot.price = price;

      await spot.save();
      return res.json(spot);
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot couldn't be found" });
  }
});

//! Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== spot.ownerId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      await spot.destroy();
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot couldn't be found" });
  }
});

//! Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      throw new Error();
    }

    const spotReviews = await Review.scope({
      method: ['bySpotId', spotId],
    }).findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: ReviewImage,
        },
      ],
    });

    return res.json({ Reviews: spotReviews });
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot couldn't be found" });
  }
});

//! Create a Review for a Spot based on the Spot's id
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateReview,
  async (req, res) => {
    try {
      const spotId = req.params.spotId;
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        throw new Error();
      }

      const { user } = req;
      if (user) {
        try {
          const userId = user.id;
          const spotReview = await Review.scope(
            {
              method: ['byUserId', userId],
            },
            { method: ['bySpotId', spotId] }
          ).findOne();
          if (spotReview) {
            throw new Error();
          }

          const { review, stars } = req.body;

          const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars,
          });

          res.statusCode = 201;
          return res.json(newReview);
        } catch (error) {
          res.statusCode = 500;
          return res.json({
            message: 'User already has a review for this spot',
          });
        }
      } else {
        return res.json({ user: null });
      }
    } catch (error) {
      res.statusCode = 404;
      return res.json({ message: "Spot couldn't be found" });
    }
  }
);

//! Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      const userId = user.id;
      if (userId === spot.ownerId) {
        const spotBookings = await Booking.scope({
          method: ['bySpotId', spotId],
        }).findAll({
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        });

        const safeSpotBookings = [];

        spotBookings.forEach(booking => {
          const safeBooking = {
            User: booking.User,
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          };

          safeSpotBookings.push(safeBooking);
        });

        return res.json({ Bookings: safeSpotBookings });
      } else {
        const userBookings = await Booking.scope(
          {
            method: ['byUserId', userId],
          },
          { method: ['bySpotId', spotId] }
        ).findAll({
          attributes: {
            exclude: ['id', 'userId', 'createdAt', 'updatedAt'],
          },
        });

        return res.json({ Bookings: userBookings });
      }
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot couldn't be found" });
  }
});

//!Create a Booking for a Spot based on the Spot's id
router.post(
  '/:spotId/bookings',
  requireAuth,
  validateBooking,
  async (req, res) => {
    try {
      const spotId = req.params.spotId;
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        throw new Error();
      }

      const { user } = req;
      if (user) {
        const userId = user.id;

        try {
          if (userId === spot.ownerId) {
            throw new Error();
          }
        } catch (error) {
          res.statusCode = 403;
          return res.json({ message: 'Forbidden' });
        }

        try {
          const startDate = new Date(req.body.startDate);
          const endDate = new Date(req.body.endDate);

          const allBookings = await Booking.scope({
            method: ['bySpotId', spotId],
          }).findAll();

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

          const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate,
          });

          return res.json(newBooking);
        } catch (error) {
          res.statusCode = 403;
          return res.json({
            message:
              'Sorry, this spot is already booked for the specified dates',
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
      return res.json({ message: "Spot couldn't be found" });
    }
  }
);

module.exports = router;