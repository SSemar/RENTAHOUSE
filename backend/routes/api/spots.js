const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models'); 
//const spot = require('../../db/models/spot');
const { check, validationResult } = require('express-validator');
const { requireAuth } = require('../../utils/auth');




//! validation for new spot
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
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error('Validation error');
        err.status = 400;
        err.errors = errors.array().reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {});
        return next(err);
      }
      next();
    }
  ];



//! GET ALL spots
router.get('/', async (req, res, next) => {
    const spots =  await Spot.findAll() 
    .catch(next);
    const spotsInfo = spots.map(spot => ({
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
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: null,
        previewImage: null,
    }));

    return res.status(200).json({ Spots: spotsInfo });
});

//! GET Spots owned by Current User
router.get('/current', async (req, res, next) => {
    const userId = req.user.id; 
    const spots = await Spot.findAll({ where: { ownerId: userId } })
        .catch(next);

    const spotsInfo = spots.map(spot => ({
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
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: null,
        previewImage: null,
    }));

    return res.status(200).json({ Spots: spotsInfo });
});


//! GET Details of a Spot from an id
router.get('/:id', async (req, res, next) => {
    const spotId = req.params.id;
    //! if the spot id is not a number
    if (isNaN(spotId)) {
        const err = new Error('Validation error');
        err.status = 400;
        err.errors = ['Spot id must be a number'];
        return next(err);
    }
    //! find the spot
    const spot = await Spot.findByPk(spotId)
    //! if the spot is not found
        if (!spot) {
            const err = new Error('Spot not found');
            err.status = 404;
            err.title = 'Spot not found';
            err.errors = ['Spot not found'];
            return next(err);
        }

    const spotInfo = {
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
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: null,
        previewImage: null,
    };

    return res.status(200).json({ Spot: spotInfo });
});


//! POST create a new spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id; 
  
    try {
      const newSpot = await Spot.create({
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
  
      return res.status(201).json(newSpot);
    } catch (err) {
      next(err);
    }
  });


 //! POST add a new image to a spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = parseInt(req.params.spotId, 10);
  
    if (isNaN(spotId)) {
      const err = new Error('Validation error');
      err.status = 400;
      err.errors = { id: '":spotId" is not a valid integer' };
      return next(err);
    }
  
    const spot = await Spot.findByPk(spotId);
  
    if (!spot) {
      const err = new Error('Spot not found');
      err.status = 404;
      err.title = 'Spot not found';
      err.errors = ['Spot not found'];
      return next(err);
    }
  
    if (spot.ownerId !== req.user.id) {
      const err = new Error('Unauthorized');
      err.status = 403;
      err.title = 'Unauthorized';
      err.errors = ['You do not have permission to add an image to this spot'];
      return next(err);
    }
  
    const { url, preview } = req.body;
  
    if (!url) {
      const err = new Error('Validation error');
      err.status = 400;
      err.errors = ['Image URL is required'];
      return next(err);
    }
  
    try {
      const newImage = await SpotImage.create({
        spotId,
        url,
        preview,
      });
  
      return res.status(201).json(newImage);
    } catch (err) {
      next(err);
    }
  });

  //! Edit a spot
router.put('/:id', requireAuth, validateSpot, async (req, res, next) => {
    const spotId = parseInt(req.params.id, 10);
  
    if (isNaN(spotId)) {
      const err = new Error('Validation error');
      err.status = 400;
      err.errors = { id: '":id" is not a valid integer' };
      return next(err);
    }
  
    const spot = await Spot.findByPk(spotId);
  
    if (!spot) {
      const err = new Error('Spot not found');
      err.status = 404;
      err.title = 'Spot not found';
      err.errors = ['Spot not found'];
      return next(err);
    }
  
    if (spot.ownerId !== req.user.id) {
      const err = new Error('Unauthorized');
      err.status = 403;
      err.title = 'Unauthorized';
      err.errors = ['You do not have permission to edit this spot'];
      return next(err);
    }
  
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
  
    try {
      await spot.update({
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
  
      return res.status(200).json(spot);
    } catch (err) {
      next(err);
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
  
    const spot = await Spot.findByPk(spotId);
  
    if (!spot) {
      const err = new Error('Spot not found');
      err.status = 404;
      err.title = 'Spot not found';
      err.errors = ['Spot not found'];
      return next(err);
    }
  
    if (spot.ownerId !== req.user.id) {
      const err = new Error('Unauthorized');
      err.status = 403;
      err.title = 'Unauthorized';
      err.errors = ['You do not have permission to delete this spot'];
      return next(err);
    }
  
    try {
      await spot.destroy();
      return res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
      next(err);
    }
  });


//   const validateReview = [
//     check('review')
//       .exists({ checkFalsy: true })
//       .withMessage('Review text is required'),
//     check('stars')
//       .isInt({ min: 1, max: 5 })
//       .withMessage('Stars must be an integer from 1 to 5'),
//     (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         const err = new Error('Validation error');
//         err.status = 400;
//         err.errors = errors.array().reduce((acc, error) => {
//           acc[error.param] = error.msg;
//           return acc;
//         }, {});
//         return next(err);
//       }
//       next();
//     }
//   ];


// Get all reviews for a spot by spotId
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

// Create a review for a spot by spotId
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  try {
    // Validate review input
    if (!review || stars === undefined || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: !review ? "Review text is required" : undefined,
          stars: stars === undefined ? "Stars must be an integer from 1 to 5" : undefined,
        },
      });
    }

    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user already has a review for this spot
    const existingReview = await Review.findOne({
      where: { spotId, userId }
    });
    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" });
    }

    // Create the new review
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    return res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

module.exports = router;