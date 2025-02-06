'use strict';

const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
      });
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
      });
    }
  }
  Spot.init(
    {
      ownerId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'Spot',
      scopes: {
        byOwnerId(ownerId) {
          return {
            where: {
              ownerId: ownerId,
            },
          };
        },
        page(page, size = 20) {
          return {
            offset: (page - 1) * size,
          };
        },
        size(size) {
          return {
            limit: size,
          };
        },
        minLat(minLat) {
          return {
            where: {
              lat: {
                [Op.gte]: minLat,
              },
            },
          };
        },
        maxLat(maxLat) {
          return {
            where: {
              lat: {
                [Op.lte]: maxLat,
              },
            },
          };
        },
        minLng(minLng) {
          return {
            where: {
              lng: {
                [Op.gte]: minLng,
              },
            },
          };
        },
        maxLng(maxLng) {
          return {
            where: {
              lng: {
                [Op.lte]: maxLng,
              },
            },
          };
        },
        minPrice(minPrice) {
          return {
            where: {
              price: {
                [Op.gte]: minPrice,
              },
            },
          };
        },
        maxPrice(maxPrice) {
          return {
            where: {
              price: {
                [Op.lte]: maxPrice,
              },
            },
          };
        },
      },
    }
  );
  return Spot;
};