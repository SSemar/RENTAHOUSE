const { check, query } = require('express-validator');
const { handleValidationErrors } = require('./validation.js');
const { Spot, User } = require('../db/models/index.js');

// Check & validate user keys at signup
const validateSignup = [
  check('email').isEmail().withMessage('Please provide a valid email.'),
  check('email')
    .exists({ checkFalsy: true })
    .isLength({ min: 3, max: 256 })
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4, max: 30 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 30 })
    .withMessage('Please provide a first name.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 30 })
    .withMessage('Please provide a last name.'),
  handleValidationErrors,
];

//! Check & validate user keys at login
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors,
];

//! Check & validate user keys when creating & updating a Spot
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city').exists({ checkFalsy: true }).withMessage('City is required'),
  check('state').exists({ checkFalsy: true }).withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage('Latitude must be within -90 & 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage('Longitude must be within -180 & 180'),
  check('name').exists({ checkFalsy: true }).withMessage('Name is required'),
  check('name')
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isInt({ min: 0.01 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors,
];

//! Check & validate user keys when creating & updating a Review
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

//! Check & validate user keys when creating & updating a Booking
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('startDate is required'),
  check('startDate').custom(async startDate => {
    if (new Date(startDate) <= new Date()) {
      throw new Error('startDate cannot be in the past');
    }
  }),
  check('startDate').custom(async (startDate, { req }) => {
    if (new Date(startDate) >= new Date(req.body.endDate)) {
      throw new Error('startDate cannot be on or after endDate');
    }
  }),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('endDate is required'),
  check('endDate').custom(async (endDate, { req }) => {
    if (new Date(endDate) <= new Date(req.body.startDate)) {
      throw new Error('endDate cannot be on or after startDate');
    }
  }),
  handleValidationErrors,
];

//! Check & validate user queries when using query filters
const validateQuery = [
  query('page').custom(async (page, { req }) => {
    if (page) {
      if (!Number.isInteger(page))
        throw new Error(
          `Page must be ≥1 & ≤${maxPages} with ${size} results per page`
        );

      const numSpots = await Spot.count();
      const size = req.query.size ? req.query.size : 20;
      const maxPages = Math.ceil(numSpots / size);
      if (page < 1 || page > maxPages) {
        throw new Error(
          `Page must be ≥1 & ≤${maxPages} with ${size} results per page`
        );
      }
    }
  }),
  query('size').custom(async size => {
    if (size) {
      if (!Number.isInteger(size))
        throw new Error('Size must be between 1 & 20');

      if (size < 1 || size > 20) {
        throw new Error('Size must be between 1 & 20');
      }
    }
  }),
  query('minLat').custom(async minLat => {
    if (minLat) {
      if (isNaN(minLat)) {
        throw new Error('Minimum latitude is invalid');
      }
      if (minLat < -90 || minLat > 90) {
        throw new Error('Minimum latitude is invalid');
      }
    }
  }),
  query('maxLat').custom(async maxLat => {
    if (maxLat) {
      if (isNaN(maxLat)) {
        throw new Error('Maximum latitude is invalid');
      }
      if (maxLat < -90 || maxLat > 90) {
        throw new Error('Maximum latitude is invalid');
      }
    }
  }),
  query('minLng').custom(async minLng => {
    if (minLng) {
      if (isNaN(minLng)) {
        throw new Error('Minimum longitude is invalid');
      }
      if (minLng < -180 || minLng > 180) {
        throw new Error('Minimum longitude is invalid');
      }
    }
  }),
  query('maxLng').custom(async maxLng => {
    if (maxLng) {
      if (isNaN(maxLng)) {
        throw new Error('Maximum longitude is invalid');
      }
      if (maxLng < -180 || maxLng > 180) {
        throw new Error('Maximum longitude is invalid');
      }
    }
  }),
  query('minPrice').custom(async minPrice => {
    if (minPrice) {
      if (minPrice < 0) {
        throw new Error('Minimum price must be greater than or equal to 0');
      }
    }
  }),
  query('maxPrice').custom(async maxPrice => {
    if (maxPrice) {
      if (maxPrice < 0) {
        throw new Error('Maximum price must be greater than or equal to 0');
      }
    }
  }),
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateSpot,
  validateReview,
  validateBooking,
  validateQuery,
};