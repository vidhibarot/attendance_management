
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      images: {
        type: Sequelize.STRING(20),
        // type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: 0,
      },
      imagepoint: {
        // type: Sequelize.STRING(20),
        type: Sequelize.JSON,  // using JSON to store the array

        // type: Sequelize.ARRAY(Sequelize.BIGINT(20).UNSIGNED),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};