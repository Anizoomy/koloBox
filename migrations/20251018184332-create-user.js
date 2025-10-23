'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        //autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
       phone: {
         type: Sequelize.STRING,
         allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
    },
    otp: {
          type: Sequelize.STRING,
          allowNull: true
     },
    otpExpiry: {
          type: Sequelize.DATE,
          allowNull: true
     },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};