const models = require ('../models');

module.exports = {

    createComment : function(req, res){
    console.log("yoooooooooo!!!!", req);
        const comment = {
        userId: req.body.userId,
        publicationId: req.params.publicationId,
        content: req.body.content,
    }
    models.Comment.create(comment)
    .then(result => {
        res.status(201).json({
            message: 'Comment created successfully',
            post: result
        });
        }).catch(error => {
            res.status(500).json({
                message: 'Something went wrong',
                error: error
            })
        });
    },
    getOneComment : function(req, res){
        const id = req.params.id;
        const publicationId = req.params.id;
        models.Comment.findOne({
            include:{
            where:{publicationId: publicationId, id : id},
            model:models.User
            }
        }).then(result => {
            if(result){
                res.status(200).json(result);
            }else{
                res.status(404).json({
                    message: "Comment not found!"
                })
            }
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            })
        });
    },
    getAllComments: function(req, res){
        models.Comment.findAll({
            where: {publicationId: req.params.publicationId},
            include:{
            model: models.User, 
            }
        }).then(result => {
            res.status(200).json(result);
        }) .catch(error => {
            res.status(500).json({
                message: 'Something went wrong'});
        });
    },
    updateComment : function(req,res){
        const id = req.params.id;
        const updatedComment ={
            content: req.body.content,
        }

        const publicationId = req.params.publicationId;
        const userId = req.body.userId;

        models.Comment.update(updatedComment, {where: {id : id, publicationId :publicationId, userId: userId}})
        .then(result => {
            res.status(200).json({
            message:"publication updated successfully",
            post: updatedComment
        });
    }).catch(error => {
        res.status(200).json({
            message: "Somenthing went wrong",
        });
    })
    },
    deleteComment: function(req, res){
        const id = req.params.id;
        const userId = req.body.userId;
        const publicationId = req.body.publicationId;
        const idToDelete = req.body.commentUserId
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
        
        models.Comment.destroy({where: {id: id, publicationId: publicationId}})
        .then(result => {
            res.status(200).json({
            message:"Comment deleted successfully"});
    }).catch(error => {
        console.log(error)
        res.status(200).json({ message: "Somenthing went wrong",});
    })
    }

}