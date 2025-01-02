'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert dummy users
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        username: 'johnsmith',
        email: 'johnsmith@example.com',
        hashedPassword: 'hashedpassword', // Replace with actual hashed password
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert dummy spots
    await queryInterface.bulkInsert('Spots', [
      {
        id: 1,
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert dummy reviews
    await queryInterface.bulkInsert('Reviews', [
      {
        id: 1,
        userId: 1,
        spotId: 1,
        review: 'This was an awesome spot!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert dummy review images
    await queryInterface.bulkInsert('ReviewImages', [
      {
        id: 1,
        reviewId: 1,
        url: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, {});
    await queryInterface.bulkDelete('Reviews', null, {});
    await queryInterface.bulkDelete('Spots', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};