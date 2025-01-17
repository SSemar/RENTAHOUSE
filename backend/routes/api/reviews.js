const express = require('express');
const router = express.Router();
const { Review, Spot, SpotImage, User, ReviewImage } = require('../../db/models');
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
  handleValidationErrors
];
//seed new data?
//redo route use current user which works as reference.
//CHECK THE ROUTE ORDER? Seems corrected not hitting the spotId route
//DROP THE DB AND TEST

//! Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const reviews = await Review.findAll({
      where: { userId: user.id },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: {
            model: SpotImage,
            attributes: ['url'],
            where: { preview: true },
            required: false
          }
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const reviewsWithPreviewImage = reviews.map(review => {
      const spot = review.Spot;
      const previewImage = spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

      return {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: review.User,
        Spot: {
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
          previewImage
        },
        ReviewImages: review.ReviewImages
      };
    });

    return res.status(200).json({ Reviews: reviewsWithPreviewImage });
  } catch (error) {
    next(error);
  }
});



//! Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { url } = req.body;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found"
      });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const reviewImage = await ReviewImage.create({
      reviewId,
      url
    });

    return res.status(201).json(reviewImage);
  } catch (error) {
    next(error);
  }
});



//! Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  try {
    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      return res.status(404).json({
        message: "Review couldn't be found"
      });
    }

    if (existingReview.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    existingReview.review = review;
    existingReview.stars = stars;

    await existingReview.save();

    return res.status(200).json(existingReview);
  } catch (error) {
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

//! DELETE a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId, {
      include: {
        model: Review,
        attributes: ['userId']
      }
    });

    if (!reviewImage) {
      return res.status(404).json({
        message: "Review Image couldn't be found"
      });
    }

    if (reviewImage.Review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    await reviewImage.destroy();
    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    next(error);
  }
});



module.exports = router;