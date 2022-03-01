'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Likes.belongsTo(models.User, { foreignKey: 'userId' })
      models.Likes.belongsTo(models.Publication, { foreignKey: 'publicationId' })
    }
  };
  Likes.init({
    publicationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Likes',
  });
  Likes.afterCreate(async like => {
    const publication = await like.getPublication()
    await publication.update({
      likesCount: publication.likes + 1
    })
  })
  Likes.afterDestroy(async like => {
    const publication = await like.getPublication()
    post.update({
      likes: publication.likes - 1
    })
  })

  Likes.afterCreate(async like => {
    const publication = await like.getPublication()
    const user = await like.getUser()

    if(user.id == publication.userId) return

  })

  return Likes;
};