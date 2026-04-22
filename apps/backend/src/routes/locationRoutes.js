const express = require('express');
const { recordLocation, getLiveMap } = require('../controllers/locationController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/ping', auth, recordLocation);
router.get('/live', auth, getLiveMap);

module.exports = router;
