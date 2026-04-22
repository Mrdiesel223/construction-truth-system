const prisma = require('../config/db');

// Get all alerts for Admin
const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      where: { resolved: false }
    });
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Resolve an alert
const resolveAlert = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await prisma.alert.update({
      where: { id: parseInt(id) },
      data: { resolved: true }
    });
    res.json(alert);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getAlerts, resolveAlert };
