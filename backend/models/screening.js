'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Screening extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Screening.belongsTo(models.Movie);
      models.Screening.belongsTo(models.Theater);
      models.Screening.hasMany(models.Booking);
    }
  }
  Screening.init({
    movieId: DataTypes.INTEGER,
    theaterId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    start_time: DataTypes.TIME,
    duration: DataTypes.INTEGER,
    language: DataTypes.STRING,
    version: DataTypes.STRING,
    price: DataTypes.DECIMAL(3,1),
    seatLayout: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Screening',
    timestamps: false
  });
  return Screening;
};