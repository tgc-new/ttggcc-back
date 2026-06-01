const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const WebsiteSettings = require('../models/WebsiteSettings');

// @GET /api/contact — Public: get contact info from settings
router.get('/', async (req, res) => {
  try {
    const settings = await WebsiteSettings.findOne()
      .select('collegeName collegeNameEn address addressEn phone email website socialLinks googleMapEmbed eiinNumber mpoNumber');
    res.json({ success: true, data: settings || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/contact — Admin: update contact details
router.put('/', protect, async (req, res) => {
  try {
    const { address, addressEn, phone, email, website, googleMapEmbed } = req.body;
    const updateData = {};
    if (address !== undefined)       updateData.address       = address;
    if (addressEn !== undefined)     updateData.addressEn     = addressEn;
    if (phone !== undefined)         updateData.phone         = Array.isArray(phone) ? phone : [phone];
    if (email !== undefined)         updateData.email         = email;
    if (website !== undefined)       updateData.website       = website;
    if (googleMapEmbed !== undefined) updateData.googleMapEmbed = googleMapEmbed;

    const settings = await WebsiteSettings.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Contact info updated', data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
