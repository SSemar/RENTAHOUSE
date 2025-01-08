const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models'); 

const { check, validationResult } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');
const moment = require('moment'); 

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

//! GET all spots
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll({
      include: [
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        },
        {
          model: Review,
          attributes: ['stars']
        }
      ]
    });
    //calc avg stars var and map array method
    const spotsInfo = spots.map(spot => {
      const totalStars = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
      const avgRating = spot.Reviews.length > 0 ? totalStars / spot.Reviews.length : null;

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt.toISOString().replace('T', ' ').replace('Z', ''),
        updatedAt: spot.updatedAt.toISOString().replace('T', ' ').replace('Z', ''),
        avgRating: avgRating,
        previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
      };
    });

    return res.status(200).json({ Spots: spotsInfo });
  } catch (error) {
    next(error);
  }
});

//! GET Spots owned by Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const spots = await Spot.findAll({
      where: { ownerId: user.id },
      include: [
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        },
        {
          model: Review,
          attributes: ['stars']
        }
      ]
    });

    const spotsInfo = spots.map(spot => {
      const totalStars = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
      const avgRating = spot.Reviews.length > 0 ? totalStars / spot.Reviews.length : null;
      const previewImage = spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        avgRating,
        previewImage
      };
    });

    return res.status(200).json({ Spots: spotsInfo });
  } catch (error) {
    next(error);
  }
});


//! GET details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: Review,
          attributes: []
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    const numReviews = await Review.count({ where: { spotId } });
    const totalStars = await Review.sum('stars', { where: { spotId } });
    const avgStarRating = numReviews > 0 ? totalStars / numReviews : null;

    const spotDetails = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      numReviews,
      avgStarRating,
      SpotImages: spot.SpotImages,
      Owner: spot.Owner
    };

    return res.status(200).json(spotDetails);
  } catch (error) {
    next(error);
  }
});

//! Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  try {
    const newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price),
    });

    return res.status(201).json({
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      createdAt: moment(newSpot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(newSpot.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    });
  } catch (error) {
    next(error);
  }
});
 //! Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    });
  } catch (error) {
    next(error);
  }
});

 //! PUT edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

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

    return res.status(200).json(spot);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        message: 'Validation error',
        errors: errors
      });
    }
    next(error);
  }
});

//! DELETE a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId, 10);

  if (isNaN(spotId)) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = { id: '":spotId" is not a valid integer' };
    return next(err);
  }

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    await spot.destroy();

    return res.status(200).json({
      message: "Successfully deleted"
    });
  } catch (error) {
    next(error);
  }
});


//! GET all spots with query filters
router.get('/', async (req, res, next) => {
  const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Validate query parameters
  const errors = {};
  if (page < 1) errors.page = "Page must be greater than or equal to 1";
  if (size < 1 || size > 20) errors.size = "Size must be between 1 and 20";
  if (minLat && isNaN(minLat)) errors.minLat = "Minimum latitude is invalid";
  if (maxLat && isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid";
  if (minLng && isNaN(minLng)) errors.minLng = "Minimum longitude is invalid";
  if (maxLng && isNaN(maxLng)) errors.maxLng = "Maximum longitude is invalid";
  if (minPrice && (isNaN(minPrice) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation error",
      errors
    });
  }

  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  const where = {};
  if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

  try {
    const spots = await Spot.findAll({
      where,
      limit,
      offset,
      include: [
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        },
        {
          model: Review,
          attributes: ['stars']
        }
      ]
    });

    const spotsInfo = spots.map(spot => {
      const totalStars = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
      const avgRating = spot.Reviews.length > 0 ? totalStars / spot.Reviews.length : null;

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt.toISOString().replace('T', ' ').replace('Z', ''),
        updatedAt: spot.updatedAt.toISOString().replace('T', ' ').replace('Z', ''),
        avgRating: avgRating,
        previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
      };
    });

    return res.status(200).json({ Spots: spotsInfo, page: parseInt(page), size: parseInt(size) });
  } catch (error) {
    next(error);
  }
});


const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];


//! Get all reviews for a spot by spotId
router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Fetch all reviews for the spot
    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: ReviewImage, as: 'ReviewImages', attributes: ['id', 'url'] },
      ],
    });

    return res.status(200).json({ Reviews: reviews });
  } catch (error) {
    next(error);
  }
});

//! POST create a review for a spot based on the spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    const existingReview = await Review.findOne({
      where: {
        spotId,
        userId
      }
    });

    if (existingReview) {
      return res.status(500).json({
        message: "User already has a review for this spot"
      });
    }

    const newReview = await Review.create({
      spotId,
      userId,
      review,
      stars
    });

    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;