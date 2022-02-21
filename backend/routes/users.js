const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user');
const auth     = require('../middleware/auth');
const multer = require('../helpers/image-uploader');

// Users routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/all',auth,userCtrl.getAllUsers);
router.get('/:id', auth,userCtrl.getUserProfile);
router.put('/:id', auth, multer.uploadImage, userCtrl.editUserProfile);
router.put('/:id/overlay',auth,multer.uploadOverlay, userCtrl.editUserOverlay);
router.delete('/:id',auth,userCtrl.deleteAccount)

module.exports = router