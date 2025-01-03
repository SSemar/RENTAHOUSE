'use strict';

const { Review } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        id: 1,
        userId: 1,
        spotId: 1,
        review: 'This was an awesome spot!',
        stars: 5,
        createdAt: new Date('2021-11-19 20:39:36'),
        updatedAt: new Date('2021-11-19 20:39:36')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, null, {});
  }
};