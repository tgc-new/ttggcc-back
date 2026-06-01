const express       = require('express');
const router        = express.Router();
const ScrollingText = require('../models/ScrollingText');
const { protect }   = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const texts = await ScrollingText.find({ isActive: true }).sort({ order: 1 }).limit(100);
    res.json({ success: true, data: texts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const texts = await ScrollingText.find().sort({ order: 1 });
    res.json({ success: true, data: texts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const count = await ScrollingText.countDocuments();
    if (count >= 100) return res.status(400).json({ success: false, message: 'সর্বোচ্চ ১০০টি স্ক্রলিং টেক্সট রাখা যাবে' });
    const t = await ScrollingText.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const t = await ScrollingText.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: t });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await ScrollingText.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
