const express = require('express');
const router  = express.Router();
const WebsiteSettings = require('../models/WebsiteSettings');
const { protect }     = require('../middleware/auth');
const { uploadImage, deleteFromCloudinary } = require('../config/cloudinary');

// @GET /api/settings — Public
router.get('/', async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) settings = await WebsiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/settings — Admin (text fields)
router.put('/', protect, async (req, res) => {
  try {
    // socialLinks may come as nested object or flat keys
    const { facebook, youtube, twitter, instagram, ...rest } = req.body;
    const updateData = { ...rest };

    if (facebook !== undefined || youtube !== undefined || twitter !== undefined || instagram !== undefined) {
      const current = await WebsiteSettings.findOne();
      updateData.socialLinks = {
        ...(current?.socialLinks || {}),
        ...(facebook  !== undefined && { facebook }),
        ...(youtube   !== undefined && { youtube }),
        ...(twitter   !== undefined && { twitter }),
        ...(instagram !== undefined && { instagram }),
      };
    }

    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(updateData);
    } else {
      settings = await WebsiteSettings.findByIdAndUpdate(settings._id, updateData, { new: true, runValidators: true });
    }
    res.json({ success: true, message: 'Settings updated', data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/settings/logo — Admin
router.put('/logo', protect, uploadImage.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Logo file required' });
    const settings = await WebsiteSettings.findOne();
    if (settings?.logo?.publicId) await deleteFromCloudinary(settings.logo.publicId);
    const updated = await WebsiteSettings.findOneAndUpdate(
      {},
      { logo: { url: req.file.path, publicId: req.file.filename } },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Logo updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/settings/principal-photo — Admin
router.put('/principal-photo', protect, uploadImage.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Photo required' });
    const settings = await WebsiteSettings.findOne();
    if (settings?.principalPhoto?.publicId) await deleteFromCloudinary(settings.principalPhoto.publicId);
    const updated = await WebsiteSettings.findOneAndUpdate(
      {},
      { principalPhoto: { url: req.file.path, publicId: req.file.filename } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/settings/chairman-photo — Admin
router.put('/chairman-photo', protect, uploadImage.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Photo required' });
    const settings = await WebsiteSettings.findOne();
    if (settings?.chairmanPhoto?.publicId) await deleteFromCloudinary(settings.chairmanPhoto.publicId);
    const updated = await WebsiteSettings.findOneAndUpdate(
      {},
      { chairmanPhoto: { url: req.file.path, publicId: req.file.filename } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
