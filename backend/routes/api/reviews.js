// //! Import required modules and middleware
// const express = require('express');
// const router = express.Router();
// const { requireAuth } = require('../../utils/auth.js');
// const { restoreUser } = require('../../utils/auth.js');
// const { validateReview, validateReviewImage } = require('../../utils/validation.js');
// const { Review, Spot, ReviewImage, User } = require('../../db/models');



// //! Get all Reviews of the Current User
// router.get('/current', requireAuth, async (req, res) => {
//     const { userId } = req.user;
//     try {
//         const reviews = await Review.findAll({
//             where: { userId },
//             include: [
//                 { model: User, attributes: ['id', 'firstName', 'lastName'] },
//                 { model: Spot },
//                 { model: ReviewImage }
//             ]
//         });

//         res.status(200).json({ Reviews: reviews });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// //! Get all Reviews by a Spot's id
// router.get('/spots/:spotId/reviews', async (req, res) => {
//     const { spotId } = req.params;
//     try {
//         const spot = await Spot.findByPk(spotId);
//         if (!spot) {
//             return res.status(404).json({ message: "Spot couldn't be found" });
//         }

//         const reviews = await Review.findAll({
//             where: { spotId },
//             include: [
//                 { model: User, attributes: ['id', 'firstName', 'lastName'] },
//                 { model: ReviewImage }
//             ]
//         });

//         res.status(200).json({ Reviews: reviews });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// //! Create a Review for a Spot based on the Spot's id
// // router.post('/spots/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
// //     const { spotId } = req.params;
// //     const { review, stars } = req.body;
// //     const { userId } = req.user;

// //     try {
// //         const spot = await Spot.findByPk(spotId);
// //         if (!spot) {
// //             return res.status(404).json({ message: "Spot couldn't be found" });
// //         }

// //         const existingReview = await Review.findOne({ where: { spotId, userId } });
// //         if (existingReview) {
// //             return res.status(500).json({ message: 'User already has a review for this spot' });
// //         }

// //         const newReview = await Review.create({ spotId, userId, review, stars });
// //         res.status(201).json(newReview);
// //     } catch (err) {
// //         res.status(500).json({ message: 'Internal server error' });
// //     }
// // });

// //! Add an Image to a Review based on the Review's id
// // router.post('/reviews/:reviewId/images', requireAuth, validateReviewImage, async (req, res) => {
// //     const { reviewId } = req.params;
// //     const { url } = req.body;

// //     try {
// //         const review = await Review.findByPk(reviewId);
// //         if (!review) {
// //             return res.status(404).json({ message: "Review couldn't be found" });
// //         }

// //         if (review.userId !== req.user.userId) {
// //             return res.status(403).json({ message: 'Forbidden' });
// //         }

// //         const imagesCount = await ReviewImage.count({ where: { reviewId } });
// //         if (imagesCount >= 10) {
// //             return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
// //         }

// //         const newImage = await ReviewImage.create({ reviewId, url });
// //         res.status(201).json(newImage);
// //     } catch (err) {
// //         res.status(500).json({ message: 'Internal server error' });
// //     }
// // });

// //!Edit a Review
// router.put('/reviews/:reviewId', requireAuth, validateReview, async (req, res) => {
//     const { reviewId } = req.params;
//     const { review, stars } = req.body;

//     try {
//         const existingReview = await Review.findByPk(reviewId);
//         if (!existingReview) {
//             return res.status(404).json({ message: "Review couldn't be found" });
//         }

//         if (existingReview.userId !== req.user.userId) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         existingReview.review = review;
//         existingReview.stars = stars;
//         await existingReview.save();

//         res.status(200).json(existingReview);
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// //! Delete a Review
// router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
//     const { reviewId } = req.params;

//     try {
//         const review = await Review.findByPk(reviewId);
//         if (!review) {
//             return res.status(404).json({ message: "Review couldn't be found" });
//         }

//         if (review.userId !== req.user.userId) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         await review.destroy();
//         res.status(200).json({ message: 'Successfully deleted' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// module.exports = router;
