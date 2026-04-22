const prisma = require('../config/db');

// Create Zone (Site -> Zone)
const createZone = async (req, res) => {
  const { siteId, name, lat, lng, radius, cameraId } = req.body;
  try {
    const zone = await prisma.zone.create({
      data: {
        siteId: parseInt(siteId),
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius: parseFloat(radius || 50),
        cameraId
      }
    });
    res.json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getZonesBySite = async (req, res) => {
  const { siteId } = req.params;
  try {
    const zones = await prisma.zone.findMany({
      where: { siteId: parseInt(siteId) }
    });
    res.json(zones);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { createZone, getZonesBySite };
