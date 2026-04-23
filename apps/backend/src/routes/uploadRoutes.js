const express = require('express');
const multer = require('multer');
const { uploadImage, uploadFile } = require('../controllers/uploadController');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/image', [auth, upload.single('image')], uploadImage);
router.post('/file', [auth, upload.single('file')], uploadFile);

module.exports = router;
