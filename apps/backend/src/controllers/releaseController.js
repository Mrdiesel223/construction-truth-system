const prisma = require('../config/db');

// Get the latest release for the mobile app to check for updates
const getLatestRelease = async (req, res) => {
  try {
    const latestRelease = await prisma.appRelease.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestRelease) {
      return res.status(404).json({ message: 'No releases found' });
    }

    res.json(latestRelease);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Admin only: Create a new release
const createRelease = async (req, res) => {
  const { version, buildNumber, downloadUrl, mandatory, releaseNotes } = req.body;

  try {
    const newRelease = await prisma.appRelease.create({
      data: {
        version,
        buildNumber: parseInt(buildNumber),
        downloadUrl,
        mandatory: mandatory || false,
        releaseNotes,
      },
    });

    res.status(201).json(newRelease);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Admin only: Get all releases
const getAllReleases = async (req, res) => {
  try {
    const releases = await prisma.appRelease.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(releases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getLatestRelease,
  createRelease,
  getAllReleases,
};
