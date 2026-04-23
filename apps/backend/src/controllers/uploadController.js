const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'field_staff_proofs',
      resource_type: 'image'
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cloud upload failed' });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary as raw file (for APKs, etc)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'field_staff_assets',
      resource_type: 'auto'
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cloud upload failed' });
  }
};

module.exports = { uploadImage, uploadFile };
