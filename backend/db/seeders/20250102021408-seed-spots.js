'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Beautiful Spot in SF',
        description: 'A cozy and wonderful place to stay.',
        price: 200.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        address: '456 Ocean Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Sunny Beach House',
        description: 'Perfect for a summer getaway.',
        price: 350.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};