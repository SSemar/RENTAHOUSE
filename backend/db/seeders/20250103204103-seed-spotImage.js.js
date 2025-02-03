'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema if needed
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1, 
        url: 'https://picsum.photos/500?v=1',
        preview: true, 
      },
      {
        spotId: 1,
        url: 'https://picsum.photos/500?v=2',
        preview: false,
      },
      {
        spotId: 2, 
        url: 'https://picsum.photos/500?v=3',
        preview: true, 
      },
      {
        spotId: 2,
        url: 'https://picsum.photos/500?v=4',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://picsum.photos/500?v=5',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://picsum.photos/500?v=6',
        preview: false,
      },
    ], {}
  );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};