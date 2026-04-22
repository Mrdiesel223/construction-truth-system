const express = require('express');
const { getAlerts, resolveAlert } = require('../controllers/alertController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, getAlerts);
router.patch('/:id/resolve', auth, resolveAlert);

module.exports = router;
