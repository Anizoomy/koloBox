'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      // Group.owner -> User
      Group.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner', onDelete: 'CASCADE' });
    }
  }

  Group.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Group'
    }
  );

  return Group;
};
