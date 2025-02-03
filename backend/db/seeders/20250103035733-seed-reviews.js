'use strict';


const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}


module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(
      options, 
      [
        {
        userId: 2,
        spotId: 1,
        review: 'Great place! and BLAH BLAH BLAH BLAH BLAH BLAH BLAH ',
        stars: 5, 
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Not bad.and BLAH BLAH BLAH BLAH BLAH BLAH BLAH ',
        stars: 3,
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Not bad.and BLAH BLAH BLAH BLAH BLAH BLAH BLAH ',
        stars: 2,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'; 
    await queryInterface.bulkDelete(
      'options', 
      {
      userId: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    }, 
    {});
  }
};