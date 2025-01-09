const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// DELETE a Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;

  console.log(`DELETE /spot-images/${imageId} route hit`);

  try {
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ['ownerId']
      }
    });

    if (!spotImage) {
      console.error("Spot Image couldn't be found");
      return res.status(404).json({
        message: "Spot Image couldn't be found"
      });
    }

    if (spotImage.Spot.ownerId !== req.user.id) {
      console.error("Forbidden");
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    await spotImage.destroy();
    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;