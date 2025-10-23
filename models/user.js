'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
          id: {
        allowNull: false,
        //autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
       phone: {
         type: DataTypes.STRING,
         allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
    },
    otp: {
          type: DataTypes.STRING,
          allowNull: true
     },
    otpExpiry: {
          type: DataTypes.DATE,
          allowNull: true
     },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};