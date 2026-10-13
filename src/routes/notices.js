const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect } = require('../middleware/auth');
const { uploadImage, uploadPDF } = require('../config/cloudinary');

// @GET /api/notices
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 15, category, isImportant, isScrolling } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (isImportant === 'true') filter.isImportant = true;
    if (isScrolling === 'true') filter.isScrolling = true;

    const total = await Notice.countDocuments(filter);
    const notices = await Notice.find(filter)
      .sort({ isImportant: -1, publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      data: notices,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/notices/scrolling
router.get('/scrolling', async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true, isScrolling: true })
      .sort({ publishDate: -1 }).limit(10).select('title titleBn publishDate');
    res.json({ success: true, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/notices/:id
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    notice.views = (notice.views || 0) + 1;
    await notice.save();
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/notices (Create Notice with proper PDF upload)
router.post('/', protect, uploadPDF.single('pdfFile'), async (req, res) => {
  try {
    const noticeData = { ...req.body };
    if (req.file) {
      noticeData.pdfFile = {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname
      };
    }
    const notice = await Notice.create(noticeData);
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/notices/:id
router.put('/:id', protect, uploadPDF.single('pdfFile'), async (req, res) => {
  try {
    let notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    const noticeData = { ...req.body };
    if (req.file) {
      noticeData.pdfFile = {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname
      };
    }
    notice = await Notice.findByIdAndUpdate(req.params.id, noticeData, { new: true });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/notices/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    await notice.deleteOne();
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
