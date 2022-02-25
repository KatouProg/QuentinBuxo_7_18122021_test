const express = require('express')
const router = express.Router()

const publicationsCtrl = require('../controllers/publications')
const commentsCtrl     = require('../controllers/comments')
const auth             = require('../middleware/auth')
const multer = require('../helpers/image-uploader');


// Publications routes
router.post('/add',auth, multer.uploadImage, publicationsCtrl.createPublication);
router.get('/all',auth, publicationsCtrl.getAllPublication);
router.get('/:id',auth, publicationsCtrl.getOnePublication);
router.put('/:id',auth, multer.uploadImage, publicationsCtrl.updatePublication);
router.delete('/:id',auth, publicationsCtrl.deletePublication);
router.post('/:publicationId/like',auth, publicationsCtrl.likes)
router.get('/:id/likes', auth, publicationsCtrl.getAllLikes)

router.post('/:publicationId/comments', auth, commentsCtrl.createComment);
router.get('/:publicationId/comments',auth, commentsCtrl.getAllComments);
router.get('/:publicationId/comments/:id',auth, commentsCtrl.getOneComment);
router.put('/:publicationId/comments/:id',auth, commentsCtrl.updateComment);
router.delete('/:publicationId/comments/:id',auth, commentsCtrl.deleteComment);

module.exports = router