module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ReviewImages', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        spotId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Spots', key: 'id' }, 
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('ReviewImages');
    },
  };
  