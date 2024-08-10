'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      release_date: {
        type: Sequelize.DATEONLY
      },
      duration: {
        type: Sequelize.INTEGER
      },
      average_rating: {
        type: Sequelize.DECIMAL(2,1)
      },
      director: {
        type: Sequelize.STRING
      },
      cast: {
        type: Sequelize.STRING
      },
      synopsis: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};