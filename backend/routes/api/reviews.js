// backend/routes/api/reviews.js
const express = require('express');

const {
  Review,
  ReviewImage,
  Spot,
  SpotImage,
  User,
} = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');
const { validateReview } = require('../../utils/validators.js');

const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  if (user) {
    const userReviews = await Review.scope({
      method: ['byUserId', user.id],
    }).findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
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
        {
          model: ReviewImage,
        },
      ],
    });

    const formattedReviews = userReviews.map(review => ({
      ...review.toJSON(),
      Spot: { ...review.Spot.toJSON(), previewImage: '' },
    }));

    formattedReviews.forEach(review => {
      review.Spot.previewImage = review.Spot.SpotImages[0]
        ? review.Spot.SpotImages[0].url
        : null;
      delete review.Spot.SpotImages;
    });

    return res.json({ Reviews: formattedReviews });
  } else {
    return res.json({ user: null });
  }
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      throw new Error();
    }

    try {
      const reviewImages = await ReviewImage.findAll({
        where: {
          reviewId: reviewId,
        },
      });

      if (reviewImages.length >= 10) {
        throw new Error();
      }
    } catch (error) {
      res.statusCode = 403;
      return res.json({
        message: 'Maximum number of images for this resource was reached',
      });
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== review.userId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      const { url } = req.body;

      const reviewImage = await ReviewImage.create({
        reviewId,
        url,
      });

      const safeReviewImage = {
        id: reviewImage.id,
        url: reviewImage.url,
      };

      res.statusCode = 201;
      return res.json(safeReviewImage);
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Review couldn't be found" });
  }
});

// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  try {
    const userReview = await Review.findByPk(req.params.reviewId);
    if (!userReview) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== userReview.userId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      const { review, stars } = req.body;

      userReview.review = review;
      userReview.stars = stars;

      await userReview.save();
      return res.json(userReview);
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Review couldn't be found" });
  }
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== review.userId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      await review.destroy();
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Review couldn't be found" });
  }
});

module.exports = router;