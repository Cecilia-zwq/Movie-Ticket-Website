'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Theater extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Theater.hasMany(models.Screening);
    }
  }
  Theater.init({
    name: DataTypes.STRING,
    rows: DataTypes.INTEGER,
    columns: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Theater',
    timestamps: false
  });
  return Theater;
};