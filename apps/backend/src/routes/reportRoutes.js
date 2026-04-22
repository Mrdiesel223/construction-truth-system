const express = require('express');
const { getDailySummary, exportCSV } = require('../controllers/reportController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/summary', auth, getDailySummary);
router.get('/export', auth, exportCSV);

module.exports = router;
