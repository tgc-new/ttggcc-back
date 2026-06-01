const express  = require('express');
const router   = express.Router();
const Approval = require('../models/Approval');
const { protect } = require('../middleware/auth');
const { uploadPDF, deleteFromCloudinary } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const items = await Approval.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Approval.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', protect, uploadPDF.single('pdfFile'), async (req, res) => {
  try {
    const data = {
      title:       req.body.titleBn || req.body.title || 'অনুমোদন',
      titleBn:     req.body.titleBn || req.body.title || 'অনুমোদন',
      type:        req.body.type        || 'approval',
      issuedBy:    req.body.issuedBy    || '',
      description: req.body.description || '',
      googleDriveLink: req.body.googleDriveLink || '',
      isActive:    req.body.isActive !== 'false',
    };
    if (req.body.issueDate) data.issueDate = req.body.issueDate;
    if (req.file) data.pdfFile = { url: req.file.path, publicId: req.file.filename, originalName: req.file.originalname };
    const item = await Approval.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, uploadPDF.single('pdfFile'), async (req, res) => {
  try {
    const data = {
      title:       req.body.titleBn || req.body.title || 'অনুমোদন',
      titleBn:     req.body.titleBn || req.body.title || 'অনুমোদন',
      type:        req.body.type,
      issuedBy:    req.body.issuedBy    || '',
      description: req.body.description || '',
      googleDriveLink: req.body.googleDriveLink || '',
    };
    if (req.body.issueDate) data.issueDate = req.body.issueDate;
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== 'false';
    if (req.file) data.pdfFile = { url: req.file.path, publicId: req.file.filename, originalName: req.file.originalname };
    const item = await Approval.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Approval.findByIdAndDelete(req.params.id);
    if (item?.pdfFile?.publicId) await deleteFromCloudinary(item.pdfFile.publicId, 'raw');
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
