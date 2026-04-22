const express = require('express');
const { createSite, getAllSites, assignWorker } = require('../controllers/siteController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, createSite);
router.get('/', auth, getAllSites);
router.post('/assign', auth, assignWorker);

module.exports = router;
