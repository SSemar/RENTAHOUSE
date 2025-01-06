const express = require('express');
const { SpotImage, ReviewImage, Spot, Review } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');


//! Add an Image to a Spot based on the Spot's id
router.post('/spots/:spotId/images', requireAuth, async (req, res, next) => {
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

    return res.status(200).json({
      message: "Successfully deleted"
    });
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
