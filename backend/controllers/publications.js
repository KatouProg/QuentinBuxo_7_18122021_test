const models = require('../models');
const jwt = require("jsonwebtoken");
require('dotenv').config();


module.exports = {

    createPublication: function (req, res) {
        const publication = {
            userId: req.body.id,
            content: req.body.content,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
            likes:0
        }
        models.Publication.create(publication).then(result => {
            res.status(201).json({
                message: 'Publication created successfully',
                post: result
            });
        }).catch(error => {
            console.log(res);
            res.status(500).json({
                message: 'Something went wrong',
                error: error
            })
        });
    },
    getOnePublication: function (req, res) {
        const id = req.params.id;
        models.Publication.findOne({
            include:{
            where:{id: publicationId},
            model:models.User
        } 
        }).then(result => {
            res.status(200).json(result);
        }).catch(error => {
            res.status(500).json({
                message: 'Something went wrong'
            });
        });
    },

    getAllPublication: function (req, res) {
        models.Publication.findAll({
           order:[[
                'createdAt', 'DESC'
           ]],
            include:{
                model:models.User,
            }}).then(result => {
            res.status(200).json(result);
        }).catch(error => {
            res.status(500).json({
                message: 'Something went wrong'
            });
        });
    },
    updatePublication: function (req, res) {
        const id = req.params.id;
        const updatedPublication = {
            content: req.body.content,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
        }

        const userId = req.body.userId;

        models.Publication.update(updatedPublication, { where: { id: id, userId: userId } })
            .then(result => {
                res.status(200).json({
                    message: "publication updated successfully",
                    publication: updatedPublication
                });
            }).catch(error => {
                res.status(200).json({
                    message: "Something went wrong",
                    error: error
                });
            })
    },
    deletePublication: function (req, res) {
        const id = req.params.id;
        const userId = req.body.userId;
        const idToDelete = req.body.publicationUserId
      if (!userId || !idToDelete) {
        res.status(401).json({message: "request invalid"});
        return;
      }

      // Is authorized
      let allowed = req.body.isAdmin;
      if (userId == idToDelete) allowed = true
      if (!allowed) {
        res.status(401).json({message: "not allowed"})
        return;
      }
        models.Publication.destroy({ where: { id: id } })
            .then(result => {
                res.status(200).json({
                    message: "publication deleted successfully"
                });
            }).catch(error => {
                res.status(200).json({
                    message: "Something went wrong",
                    error : error
                });
            })
    },
    likes: async function (req, res) {
        const userId = req.body.userId;
        const publicationId = req.params.publicationId

        const likeHere = await models.Likes.findOne({where: {userId: userId, publicationId: publicationId}})
        if (likeHere) {
            //console.log(likeHere);
               await likeHere.destroy ()
                  .then(() => res.status(200).json({message: 'like destroy'}))
                  .catch(error => res.status(400).json({error}))
            }else {
                await models.Likes.create({publicationId: publicationId, userId: userId })
                .then(() => res.status(200).json({message: 'like create'}))
                .catch(error => res.status(400).json({error}, "yoooooooo"))
                 }
    },
    getAllLikes: async function(req, res){
        const allLikes = await models.Likes.findAndCountAll({
            where: {publicationId: req.params.publicationId},
            includes: models.User
        })
        console.log(allLikes);
        if(allLikes) {
            return res.status(200).json({allLikes})
        } else {
            return res.status(400).json("error couzin !!!")
        }
    }
}
