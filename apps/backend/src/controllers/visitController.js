const { validationResult } = require('express-validator');
const prisma = require('../config/db');

const createVisit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { customerName, purpose, notes, imageUrl, lat, lng } = req.body;

  try {
    const visit = await prisma.visit.create({
      data: {
        userId: req.user.id,
        customerName,
        purpose,
        notes,
        imageUrl,
        lat,
        lng,
      },
    });

    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getVisitHistory = async (req, res) => {
  try {
    const visits = await prisma.visit.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { createVisit, getVisitHistory };
