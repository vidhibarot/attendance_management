
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_master', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: {
          model: 'user', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      minutes: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      ot_minutes: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
        defaultValue: 0,
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
    await queryInterface.dropTable('attendance_master');
  }
};