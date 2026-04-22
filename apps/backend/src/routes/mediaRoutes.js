const express = require('express');
const { getAllProofs, verifyProof } = require('../controllers/mediaController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/all', auth, getAllProofs);
router.patch('/:id/verify', auth, verifyProof);

module.exports = router;
