'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Rating.belongsTo(models.User);
      models.Rating.belongsTo(models.Movie);
    }
  }
  Rating.init({
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};