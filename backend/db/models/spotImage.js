const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }

  SpotImage.init(
    {
      spotId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      preview: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'SpotImage',
      defaultScope: {
        attributes: {
          include: ['id', 'url', 'preview'],
          exclude: ['spotId', 'createdAt', 'updatedAt'],
        },
      },
      scopes: {
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
  return SpotImage;
};