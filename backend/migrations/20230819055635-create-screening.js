'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Screenings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movieId: {
        type: Sequelize.INTEGER
      },
      theaterId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      start_time: {
        type: Sequelize.TIME
      },
      end_time: {
        type: Sequelize.TIME
      },
      language: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      seat_layout: {
        type: Sequelize.JSON
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Screenings');
  }
};