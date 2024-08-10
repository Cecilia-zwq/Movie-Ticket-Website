'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Booking);
      models.User.hasMany(models.Rating);
    }
  }
  User.init({
    user_name: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    full_name: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });
  return User;
};