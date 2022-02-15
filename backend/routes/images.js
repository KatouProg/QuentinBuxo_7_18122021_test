const express     = require('express');
const imageCtrl   = require('../controllers/images');
const multer = require('../helpers/image-uploader');
const auth        = require ('../middleware/auth');

const router = express.Router();

router.post('/upload', auth,multer.uploadImage, imageCtrl.upload);

module.exports = router;