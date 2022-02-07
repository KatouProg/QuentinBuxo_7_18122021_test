'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    static associate(models) {
      models.Messages.belongsTo(models.Users, {
        foreignKey: 'userId',
        });
    }
  }
  Messages.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};