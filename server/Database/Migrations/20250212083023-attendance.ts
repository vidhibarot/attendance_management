
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      master_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: 'attendance_master', key: 'id', as: 'master_id' },
        onDelete: 'CASCADE'
      },
      check_in: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      check_out: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      minutes: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      ot_minutes: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: 1,
        comment: "0 => Inactive, 1 => Active"
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
    await queryInterface.dropTable('attendance');
  }
};