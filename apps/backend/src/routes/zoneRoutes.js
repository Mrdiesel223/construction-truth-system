const express = require('express');
const { createZone, getZonesBySite } = require('../controllers/zoneController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, createZone);
router.get('/:siteId', auth, getZonesBySite);

module.exports = router;
