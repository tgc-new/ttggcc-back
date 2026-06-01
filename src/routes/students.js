const express = require('express');
const router = express.Router();
const StudentStats = require('../models/StudentStats');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const stats = await StudentStats.findOne({ isCurrent: true });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    await StudentStats.updateMany({}, { isCurrent: false });
    const stats = await StudentStats.create({ ...req.body, isCurrent: true });
    res.status(201).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const stats = await StudentStats.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
