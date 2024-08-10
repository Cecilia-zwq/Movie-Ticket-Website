'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Movie.hasMany(models.Screening);
      models.Movie.hasMany(models.Rating);
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    release_date: DataTypes.DATEONLY,
    duration: DataTypes.INTEGER,
    average_rating: DataTypes.DECIMAL,
    director: DataTypes.STRING,
    cast: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
    timestamps: false
  });
  return Movie;
};