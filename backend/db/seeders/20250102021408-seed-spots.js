'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {      
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'Disneyland',
        description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Elementum morbi tellus sem euismod vestibulum tempor scelerisque ad sapien. Efficitur vestibulum maximus massa curabitur libero quis congue.',
        price: 123,
      },
      {
        ownerId: 2,
        address: 'Test lane drive 1',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States of America',
        lat: 77.7645358,
        lng: 99.4730327,
        name: 'Test Spot 1',
        description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Elementum morbi tellus sem euismod vestibulum tempor scelerisque ad sapien. Efficitur vestibulum maximus massa curabitur libero quis congue.',
        price: 5000,
      },
      {
        ownerId: 2,
        address: 'Test lane drive 2',
        city: 'New York',
        state: 'New York',
        country: 'United States of America',
        lat: 71.7645338,
        lng: -99.4730327,
        name: 'Test Spot 2',
        description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Elementum morbi tellus sem euismod vestibulum tempor scelerisque ad sapien. Efficitur vestibulum maximus massa curabitur libero quis congue.',
        price: 10000,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options,
      {
        name: {
          [Sequelize.Op.in]: ['Disneyland', 'Test Spot 1', 'Test Spot 2'],
        },
      },
      {});
  }
};