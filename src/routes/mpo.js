const express = require('express');
const router  = express.Router();
const MpoInfo = require('../models/MpoInfo');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    let info = await MpoInfo.findOne({ isActive:true });
    res.json({ success:true, data:info });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    await MpoInfo.updateMany({}, { isActive:false });
    const info = await MpoInfo.create({ ...req.body, isActive:true });
    res.status(201).json({ success:true, data:info });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const info = await MpoInfo.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ success:true, data:info });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
});

module.exports = router;
