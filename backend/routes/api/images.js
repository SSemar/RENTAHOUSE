const express = require('express');
const { SpotImage, ReviewImage, Spot, Review } = require('../../db/models');
const router = express.Router();




//! DELETE a Spot Image
router.delete('/spot-images/:imageId', async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const spotImage = await SpotImage.findByPk(imageId, {
            include: { model: Spot, as: 'Spot' },
        });

        if (!spotImage) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }

        
        if (spotImage.Spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await spotImage.destroy();
        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        next(error);
    }
});

//! DELETE a Review Image
router.delete('/review-images/:imageId', async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const reviewImage = await ReviewImage.findByPk(imageId, {
            include: { model: Review, as: 'Review' },
        });

        if (!reviewImage) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        
        if (reviewImage.Review.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await reviewImage.destroy();
        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
