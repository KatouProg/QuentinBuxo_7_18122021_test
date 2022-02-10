'use strict';
module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    messageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    isLike: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here

    models.Users.belongsToMany(models.Messages, {
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'messageId',
    });

    models.Message.belongsToMany(models.Users, {
      through: models.Like,
      foreignKey: 'messageId',
      otherKey: 'userId',
    });

    models.Like.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
    });

    models.Like.belongsTo(models.Messages, {
      foreignKey: 'messageId',
      as: 'message',
    });
  };
  return Like;
};