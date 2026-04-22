const prisma = require('../config/db');

// Create a new construction site (Admin Only)
const createSite = async (req, res) => {
  const { name, address, lat, lng, radius } = req.body;
  try {
    const site = await prisma.site.create({
      data: {
        name,
        address,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius: parseFloat(radius || 500)
      }
    });
    res.json(site);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all sites
const getAllSites = async (req, res) => {
  try {
    const sites = await prisma.site.findMany({
      include: {
        _count: {
          select: { workers: true, tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Assign worker to site
const assignWorker = async (req, res) => {
  const { siteId, userId } = req.body;
  try {
    const site = await prisma.site.update({
      where: { id: parseInt(siteId) },
      data: {
        workers: {
          connect: { id: parseInt(userId) }
        }
      }
    });
    res.json(site);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { createSite, getAllSites, assignWorker };
