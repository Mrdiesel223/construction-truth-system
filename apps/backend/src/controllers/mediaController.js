const prisma = require('../config/db');

// Get all proofs for Admin
const getAllProofs = async (req, res) => {
  try {
    const proofs = await prisma.media.findMany({
      include: {
        user: { select: { name: true } },
        task: { select: { title: true, site: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(proofs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify a proof
const verifyProof = async (req, res) => {
  const { id } = req.params;
  try {
    const proof = await prisma.media.update({
      where: { id: parseInt(id) },
      data: { 
        verified: true,
        verifiedAt: new Date()
      }
    });
    res.json(proof);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getAllProofs, verifyProof };
