const { validationResult } = require('express-validator');
const prisma = require('../config/db');

const logAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, lat, lng } = req.body;

  try {
    const attendance = await prisma.attendance.create({
      data: {
        userId: req.user.id,
        type,
        lat,
        lng,
      },
    });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getAttendanceHistory = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { logAttendance, getAttendanceHistory };
