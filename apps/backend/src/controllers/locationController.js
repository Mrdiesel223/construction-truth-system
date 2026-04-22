const prisma = require('../config/db');
const { getDistance } = require('../utils/geo');

// Record live location ping
const recordLocation = async (req, res) => {
  const { lat, lng } = req.body;
  try {
    // 1. Save location
    const location = await prisma.location.create({
      data: {
        userId: req.user.id,
        lat,
        lng,
        timestamp: new Date()
      }
    });

    // 2. Intelligence: Check for Geofence Breaches
    // Find active tasks for this user
    const activeTasks = await prisma.task.findMany({
      where: {
        assignedToId: req.user.id,
        status: 'IN_PROGRESS'
      },
      include: {
        assignedTo: true
      }
    });

    for (const task of activeTasks) {
      // Find the site for this task
      const site = await prisma.site.findFirst({
        where: { name: task.site } // Site is currently linked by name in this simple schema
      });

      if (site) {
        const distance = getDistance(lat, lng, site.lat, site.lng);
        if (distance > site.radius) {
          // TRUTH VIOLATION: Create Alert
          await prisma.alert.create({
            data: {
              userId: req.user.id,
              type: 'GEOFENCE_BREACH',
              severity: 'HIGH',
              message: `${task.assignedTo.name} left the site boundary for task "${task.title}" (Distance: ${Math.round(distance)}m)`
            }
          });
        }
      }
    }

    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get last known locations for all workers (Admin)
const getLiveMap = async (req, res) => {
  try {
    // Get the most recent location for each user
    const workers = await prisma.user.findMany({
      where: { role: 'FIELD_STAFF' },
      select: {
        id: true,
        name: true,
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });
    res.json(workers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { recordLocation, getLiveMap };
