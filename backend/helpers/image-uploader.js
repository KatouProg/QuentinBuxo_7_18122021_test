const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'back/images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Unsupportable File'), false);
    }
}

const upload = (req, res, next, attribute) => {
    var _multer = multer({
        storage: storage,
        fileFilter: fileFilter
    });
    try {
        return _multer.single(attribute)(req, res, next);
    }
    catch {
        res.send('no ' + attribute);
    }
}
const uploadImage = (req, res, next) => upload(req,res,next,'image');
const uploadOverlay = (req, res, next) => upload(req,res,next,'overlay');

module.exports = {
    uploadImage :uploadImage,
    uploadOverlay: uploadOverlay

}



