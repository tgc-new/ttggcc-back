const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const { uploadImage, deleteFromCloudinary } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const { category, isSlider, isFeatured, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category)              filter.category   = category;
    if (isSlider   === 'true') filter.isSlider   = true;
    if (isFeatured === 'true') filter.isFeatured = true;

    const total  = await Gallery.countDocuments(filter);
    const images = await Gallery.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: images, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

    const { isSlider, isFeatured, isActive, ...rest } = req.body;

    const gallery = await Gallery.create({
      title:      rest.title    || rest.titleBn || 'ছবি',
      titleBn:    rest.titleBn  || rest.title   || '',
      category:   rest.category || 'other',
      order:      parseInt(rest.order) || 0,
      isSlider:   isSlider   === 'true' || isSlider   === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isActive:   isActive   !== 'false' && isActive  !== false,
      image: { url: req.file.path, publicId: req.file.filename },
    });

    res.status(201).json({ success: true, message: 'Image uploaded', data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { isSlider, isFeatured, isActive, ...rest } = req.body;
    const update = {
      ...rest,
      isSlider:   isSlider   === 'true' || isSlider   === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    };
    if (isActive !== undefined) update.isActive = isActive !== 'false' && isActive !== false;
    const updated = await Gallery.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Image not found' });
    if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId);
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
