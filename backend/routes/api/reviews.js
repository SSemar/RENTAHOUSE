const express = require('express');
const router = express.Router();
const { Spot, Review, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Validation middleware for creating and updating a review
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
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

//seed new data?
//redo route use current user which works as reference.
//CHECK THE ROUTE ORDER? Seems corrected not hitting the spotId route
//DROP THE DB AND TEST

//! Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        {
          model: Spot,
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',
          ],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false, // Include Spots without preview images
            },
          ],
        },
        {
          model: ReviewImage,
          as: 'ReviewImages',
          attributes: ['id', 'url'],
        },
      ],
    });

    const reviewsInfo = reviews.map((review) => {
      const spot = review.Spot;
      const previewImage = spot?.SpotImages?.[0]?.url || null;

      return {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: {
          id: review.User.id,
          firstName: review.User.firstName,
          lastName: review.User.lastName,
        },
        Spot: spot
          ? {
              id: spot.id,
              ownerId: spot.ownerId,
              address: spot.address,
              city: spot.city,
              state: spot.state,
              country: spot.country,
              lat: spot.lat,
              lng: spot.lng,
              name: spot.name,
              price: spot.price,
              previewImage: previewImage,
            }
          : null,
        ReviewImages: review.ReviewImages.map((image) => ({
          id: image.id,
          url: image.url,
        })),
      };
    });

    return res.status(200).json({ Reviews: reviewsInfo });
  } catch (error) {
    console.error(error); // Debugging
    next(error);
  }
});



//! POST add a new image to a review based on review id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { url } = req.body;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const imageCount = await ReviewImage.count({ where: { reviewId } });
    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    return res.status(201).json(newImage);
  } catch (err) {
    next(err);
  }
});

//! Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  try {
    // Check if the review exists
    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the review belongs to the current user
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update the review
    existingReview.review = review;
    existingReview.stars = stars;
    await existingReview.save();

    // Respond with the updated review
    return res.status(200).json(existingReview);
  } catch (error) {
    // Handle Sequelize validation errors consistently
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }
    // Pass any other errors to the global error handler
    next(error);
  }
});

//! DELETE a review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.destroy();
    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;