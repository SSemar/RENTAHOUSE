'use strict';

const { Model } = require('sequelize');
const validator = require('validator'); // Import the validator library

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
      User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        validate: {
          len: [60, 60],
        },
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: [
            'email',
            'hashedPassword',
            'firstName',
            'lastName',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    }
  );
  return User;
};