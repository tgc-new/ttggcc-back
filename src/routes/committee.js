// committee.js
const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');
const { protect } = require('../middleware/auth');
const { uploadTeacher, deleteFromCloudinary } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const members = await Committee.find({ isActive: true }).sort({ type: 1, order: 1 });
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, uploadTeacher.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = { url: req.file.path, publicId: req.file.filename };
    const member = await Committee.create(data);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, uploadTeacher.single('photo'), async (req, res) => {
  try {
    const member = await Committee.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    const data = { ...req.body };
    if (req.file) {
      if (member.photo?.publicId) await deleteFromCloudinary(member.photo.publicId);
      data.photo = { url: req.file.path, publicId: req.file.filename };
    }
    const updated = await Committee.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await Committee.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    if (member.photo?.publicId) await deleteFromCloudinary(member.photo.publicId);
    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
