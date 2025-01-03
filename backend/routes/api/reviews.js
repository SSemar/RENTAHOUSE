const express = require('express');
const router = express.Router();
const { Spot, Review, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');



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
  console.log('Fetching reviews for user:', userId);

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'] },
        { model: ReviewImage, as: 'ReviewImages', attributes: ['id', 'url'] }
      ]
    });

    if (!reviews || reviews.length === 0) {
      console.log('No reviews found for user:', userId);
    }

    return res.status(200).json({ Reviews: reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err.message, err.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



//!!_________________________________________________
router.get('/spot/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  // Check if spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Fetch reviews for the spot
  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: ReviewImage, as: 'ReviewImages', attributes: ['id', 'url'] },
    ],
  });

  res.status(200).json({ Reviews: reviews });
});


//!---------------------------------------------------
router.post('/spot/:spotId/reviews', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!review || stars === undefined || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: !review ? "Review text is required" : undefined,
        stars: stars === undefined ? "Stars must be an integer from 1 to 5" : undefined,
      },
    });
  }

  // Check if spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Check if the user already has a review for the spot
  const existingReview = await Review.findOne({ where: { spotId, userId } });
  if (existingReview) {
    return res.status(500).json({ message: "User already has a review for this spot" });
  }

  // Create the review
  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars,
  });

  res.status(201).json(newReview);
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

//! PUT edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  try {
    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (existingReview.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await existingReview.update({
      review,
      stars,
    });

    return res.status(200).json(existingReview);
  } catch (err) {
    next(err);
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