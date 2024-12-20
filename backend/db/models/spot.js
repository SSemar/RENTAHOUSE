'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      
     // Spot.belongsTo(models.User, { foreignKey: 'ownerId' });

      
     // Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', as: 'images' });

      
     // Spot.hasMany(models.Review, { foreignKey: 'spotId', as: 'reviews' });
    }
  }

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        validate: {
          min: -90,
          max: 90,
          isFloat: true,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        validate: {
          min: -180,
          max: 180,
          isFloat: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50], 
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0, 
        },
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );

  return Spot;
};
