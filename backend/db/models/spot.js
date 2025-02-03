const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner', onDelete: 'CASCADE' });
    }

    toJSON() {
      return {
        ...this.get(),
        lat: parseFloat(this.lat),
        lng: parseFloat(this.lng),
        price: parseFloat(this.price),
        createdAt: moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
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
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
    },  
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};