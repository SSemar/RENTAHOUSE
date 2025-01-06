const express = require('express');
const { SpotImage, ReviewImage, Spot, Review } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');




//! DELETE a Spot Image
router.delete('/spot-images/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;

  try {
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ['ownerId']
      }
    });

    if (!spotImage) {
      return res.status(404).json({
        message: "Spot Image couldn't be found"
      });
    }

    if (spotImage.Spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    await spotImage.destroy();
    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    next(error);
  }
});

//! DELETE a Review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await reviewImage.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
