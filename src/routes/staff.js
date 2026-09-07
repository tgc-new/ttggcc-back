const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');
const { uploadStaff, deleteFromCloudinary } = require('../config/cloudinary');

// @GET /api/staff
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.employeeType = type;
    const staff = await Staff.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/staff/:id
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/staff - Admin
router.post('/', protect, uploadStaff.single('photo'), async (req, res) => {
  try {
    const staffData = { ...req.body };
    if (req.file) {
      staffData.photo = { url: req.file.path, publicId: req.file.filename };
    }
    const staff = await Staff.create(staffData);
    res.status(201).json({ success: true, message: 'Staff added', data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/staff/:id - Admin
router.put('/:id', protect, uploadStaff.single('photo'), async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    const updateData = { ...req.body };
    if (req.file) {
      if (staff.photo?.publicId) await deleteFromCloudinary(staff.photo.publicId);
      updateData.photo = { url: req.file.path, publicId: req.file.filename };
    }
    const updated = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Staff updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @DELETE /api/staff/:id - Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    if (staff.photo?.publicId) await deleteFromCloudinary(staff.photo.publicId);
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
