'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Booking.belongsTo(models.User);
      models.Booking.belongsTo(models.Screening);
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    screeningId: DataTypes.INTEGER,
    seatRow: DataTypes.INTEGER,
    seatColumn: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking'
  });
  return Booking;
};