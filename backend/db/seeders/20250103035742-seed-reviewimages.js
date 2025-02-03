'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://picsum.photos/500?v=7',
        
      },
      {
        reviewId: 2,
        url: 'https://picsum.photos/500?v=8',
      },
      {
        reviewId: 3,
        url: 'https://picsum.photos/500?v=9',
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(
      options, 
      {
        reviewId: {
          [Sequelize.Op.in]: [1, 2, 3],
        },
      }
    );
  }
};