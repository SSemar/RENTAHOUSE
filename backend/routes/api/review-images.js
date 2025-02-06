// backend/routes/api/review-images.js
const express = require('express');

const { requireAuth } = require('../../utils/auth.js');
const { Review, ReviewImage } = require('../../db/models/index.js');

const router = express.Router();

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
  try {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
      include: [
        {
          model: Review,
        },
      ],
    });
    if (!reviewImage) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== reviewImage.Review.userId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      await reviewImage.destroy();
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Review Image couldn't be found" });
  }
});

module.exports = router;