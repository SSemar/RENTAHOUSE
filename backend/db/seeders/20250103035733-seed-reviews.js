'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          userId: 2,
          spotId: 1,
          review: `Lorem ipsum odor amet, consectetuer adipiscing elit. Nulla fermentum feugiat, ligula iaculis tempor himenaeos natoque. Sapien odio purus elementum natoque vulputate convallis metus. Platea ad venenatis, erat vivamus torquent lacus. Placerat nibh integer eu parturient at sit torquent vehicula felis. Hendrerit nisl placerat placerat maximus id magna pharetra convallis sodales. Dictum rhoncus quisque platea augue nulla penatibus natoque. Cras potenti euismod cursus malesuada; conubia magnis. Blandit mollis arcu velit rutrum ac.`,
          stars: 5,
        },
        {
          userId: 3,
          spotId: 1,
          review: `Lorem ipsum odor amet, consectetuer adipiscing elit. Nulla fermentum feugiat, ligula iaculis tempor himenaeos natoque. Sapien odio purus elementum natoque vulputate convallis metus. Platea ad venenatis, erat vivamus torquent lacus. Placerat nibh integer eu parturient at sit torquent vehicula felis. Hendrerit nisl placerat placerat maximus id magna pharetra convallis sodales. Dictum rhoncus quisque platea augue nulla penatibus natoque. Cras potenti euismod cursus malesuada; conubia magnis. Blandit mollis arcu velit rutrum ac.`,
          stars: 4,
        },
        {
          userId: 2,
          spotId: 2,
          review: `Lorem ipsum odor amet, consectetuer adipiscing elit. Nulla fermentum feugiat, ligula iaculis tempor himenaeos natoque. Sapien odio purus elementum natoque vulputate convallis metus. Platea ad venenatis, erat vivamus torquent lacus. Placerat nibh integer eu parturient at sit torquent vehicula felis. Hendrerit nisl placerat placerat maximus id magna pharetra convallis sodales. Dictum rhoncus quisque platea augue nulla penatibus natoque. Cras potenti euismod cursus malesuada; conubia magnis. Blandit mollis arcu velit rutrum ac.`,
          stars: 3,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};