'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
      });
    }
  }
  Review.init(
    {
      userId: DataTypes.INTEGER,
      spotId: DataTypes.INTEGER,
      review: DataTypes.TEXT,
      stars: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Review',
      scopes: {
        byUserId(userId) {
          return {
            where: {
              userId: userId,
            },
          };
        },
        bySpotId(spotId) {
          return {
            where: {
              spotId: spotId,
            },
          };
        },
      },
    }
  );
  return Review;
};