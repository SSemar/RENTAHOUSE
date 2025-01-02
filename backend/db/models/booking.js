


module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spotId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {});
    
    Booking.associate = function(models) {
        // define association here
        Booking.belongsTo(models.User, { foreignKey: 'userId' });
        Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
    return Booking;
};