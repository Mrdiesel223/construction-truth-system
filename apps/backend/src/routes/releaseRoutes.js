const express = require('express');
const { getLatestRelease, createRelease, getAllReleases } = require('../controllers/releaseController');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');

const router = express.Router();

// @route   GET api/releases/latest
// @desc    Get latest release info
// @access  Public
router.get('/latest', getLatestRelease);

// @route   POST api/releases
// @desc    Create a new release
// @access  Private (Admin)
router.post('/', [auth, roleAuth(['ADMIN'])], createRelease);

// @route   GET api/releases
// @desc    Get all releases
// @access  Private (Admin)
router.get('/', [auth, roleAuth(['ADMIN'])], getAllReleases);

module.exports = router;
