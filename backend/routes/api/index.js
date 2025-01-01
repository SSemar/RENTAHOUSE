
// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const bookingRouter = require('./bookings.js'); 
const imageRouter = require('./images.js'); 
const reviewRouter = require('./reviews.js'); 
const { restoreUser } = require("../../utils/auth.js");



// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

router.use(restoreUser);


router.use('/session', sessionRouter); // Use session router
router.use('/users', usersRouter); // Use users routers
router.use('/spots', spotRouter); // Use spots routers
router.use('/bookings', bookingRouter); // Use bookings router
router.use('/images', imageRouter); // Use images router
//router.use('/reviews', reviewRouter); // Use reviews router


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});



module.exports = router;
