const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models'); 

const { check, query, validationResult } = require('express-validator');
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

    return res.status(201).json(newSpot);
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

//! RETURN AS STRING ATM WORK ON FINDING A WAY TO RETURN NUMBER
//ideas maybe change the models to return as number
//! is the route to get all the spots owned by the current user wrong order
//! I think the order is correct

// //! GET Spots owned by Current User
// router.get('/current', requireAuth, async (req, res, next) => {
//   const { user } = req;

//   try {
//     const spots = await Spot.findAll({
//       where: { ownerId: user.id },
//       include: [
//         {
//           model: SpotImage,
//           attributes: ['url'],
//           where: { preview: true },
//           required: false
//         },
//         {
//           model: Review,
//           attributes: ['stars']
//         }
//       ]
//     });

//     const spotsInfo = spots.map(spot => {
//       const totalStars = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
//       const avgRating = spot.Reviews.length > 0 ? totalStars / spot.Reviews.length : null;
//       const previewImage = spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

//       return {
//         id: spot.id,
//         ownerId: spot.ownerId,
//         address: spot.address,
//         city: spot.city,
//         state: spot.state,
//         country: spot.country,
//         lat: parseFloat(spot.lat),
//         lng: parseFloat(spot.lng),
//         name: spot.name,
//         description: spot.description,
//         price: parseFloat(spot.price),
//         createdAt: moment(spot.createdAt).format('YYYY-MM-DD HH:mm:ss'),
//         updatedAt: moment(spot.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
//         avgRating,
//         previewImage
//       };
//     });

//     return res.status(200).json({ Spots: spotsInfo });
//   } catch (error) {
//     next(error);
//   }
// });

// //! Create a Spot
// router.post('/', requireAuth, validateSpot, async (req, res, next) => {
//   const { address, city, state, country, lat, lng, name, description, price } = req.body;
//   const { user } = req;

//   try {
//     const newSpot = await Spot.create({
//       ownerId: user.id,
//       address,
//       city,
//       state,
//       country,
//       lat: parseFloat(lat),
//       lng: parseFloat(lng),
//       name,
//       description,
//       price: parseFloat(price),
//     });

//     return res.status(201).json(newSpot);
//   } catch (error) {
//     next(error);
//   }
// });


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



//!-------------------SPOTS VALIDATE QUERY -------------------!
//! validate test to see if work on postman
const validateQueryParams = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than or equal to 1'),
  query('size').optional().isInt({ min: 1, max: 20 }).withMessage('Size must be between 1 and 20'),
  query('minLat').optional().isFloat().withMessage('Minimum latitude is invalid'),
  query('maxLat').optional().isFloat().withMessage('Maximum latitude is invalid'),
  query('minLng').optional().isFloat().withMessage('Minimum longitude is invalid'),
  query('maxLng').optional().isFloat().withMessage('Maximum longitude is invalid'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

//! GET all spots with query filters
//! GET all spots with query filters
router.get('/', validateQueryParams, async (req, res, next) => {
  const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

  try {
    const spots = await Spot.findAll({
      where,
      limit: size,
      offset: (page - 1) * size,
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

    return res.status(200).json({ Spots: spotsInfo, page: parseInt(page), size: parseInt(size) });
  } catch (error) {
    next(error);
  }
});


//! DELETE a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId, 10);
  //! check if spotId is a valid integer
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


//!-------------------REVIEWS-------------------!
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