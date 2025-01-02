//keep
const { Model, Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // define association here
     // Review.belongsTo(models.User, { foreignKey: 'userId' });
      //Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }

  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
}