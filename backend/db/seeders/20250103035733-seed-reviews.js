'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews'; // Add table name to options
    await queryInterface.bulkInsert(
      options, // Pass the options object
      [
        {
        spotId: 1,
        userId: 1,
        review: 'Great place!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Not bad.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'; 
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};