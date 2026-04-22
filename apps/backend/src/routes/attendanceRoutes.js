const express = require('express');
const { logAttendance, getAttendanceHistory } = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');
const { body } = require('express-validator');

const router = express.Router();

// @route   POST api/attendance
// @desc    Log attendance (Start/End Day)
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      body('type').isIn(['START_DAY', 'END_DAY']).withMessage('Type must be START_DAY or END_DAY'),
      body('lat').isFloat().withMessage('Valid latitude is required'),
      body('lng').isFloat().withMessage('Valid longitude is required'),
    ],
  ],
  logAttendance
);

// @route   GET api/attendance
// @desc    Get user attendance history
// @access  Private
router.get('/', auth, getAttendanceHistory);

module.exports = router;
