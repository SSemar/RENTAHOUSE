const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js');
const imageRouter = require('./images.js'); 
const { restoreUser } = require('../../utils/auth.js');

// Connect restoreUser middleware
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);
router.use('/images', imageRouter); 

const spotImageRouter = require('./spotImages.js'); // Import the spot images router
const reviewImageRouter = require('./reviewImages.js'); // Import the review images router






router.use('/spot-images', spotImageRouter); // Register the spot images routes under /spot-images
router.use('/review-images', reviewImageRouter); // Register the review images routes under /review-images




router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;