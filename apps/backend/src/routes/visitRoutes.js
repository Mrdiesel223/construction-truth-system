const express = require('express');
const { createVisit, getVisitHistory } = require('../controllers/visitController');
const auth = require('../middlewares/auth');
const { body } = require('express-validator');

const router = express.Router();

// @route   POST api/visits
// @desc    Create a visit entry
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      body('customerName').notEmpty().withMessage('Customer name is required'),
      body('purpose').notEmpty().withMessage('Purpose is required'),
      body('lat').isFloat().withMessage('Valid latitude is required'),
      body('lng').isFloat().withMessage('Valid longitude is required'),
    ],
  ],
  createVisit
);

// @route   GET api/visits
// @desc    Get user visit history
// @access  Private
router.get('/', auth, getVisitHistory);

module.exports = router;
