const express  = require('express');
const router   = express.Router();
const Routine  = require('../models/Routine');
const { protect } = require('../middleware/auth');
const { uploadPDF, deleteFromCloudinary } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    const items = await Routine.find(filter).sort({ publishDate: -1 });
    res.json({ success: true, data: items });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', protect, uploadPDF.single('pdfFile'), async (req, res) => {
  try {
    const { isActive, ...rest } = req.body;
    const data = {
      title:   rest.titleBn || rest.title || 'রুটিন',
      titleBn: rest.titleBn || rest.title || 'রুটিন',
      type:    rest.type    || 'class',
      session: rest.session || '',
      googleDriveLink:     rest.googleDriveLink     || '',
      googleDriveFileName: rest.googleDriveFileName || '',
      isActive: isActive !== 'false',
    };
    if (req.file) data.pdfFile = { url: req.file.path, publicId: req.file.filename, originalName: req.file.originalname };
    const item = await Routine.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, uploadPDF.single('pdfFile'), async (req, res) => {
  try {
    const { isActive, ...rest } = req.body;
    const data = {
      title:   rest.titleBn || rest.title || 'রুটিন',
      titleBn: rest.titleBn || rest.title || 'রুটিন',
      type:    rest.type,
      session: rest.session,
      googleDriveLink:     rest.googleDriveLink     || '',
      googleDriveFileName: rest.googleDriveFileName || '',
    };
    if (isActive !== undefined) data.isActive = isActive !== 'false';
    if (req.file) data.pdfFile = { url: req.file.path, publicId: req.file.filename, originalName: req.file.originalname };
    const item = await Routine.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Routine.findByIdAndDelete(req.params.id);
    if (item?.pdfFile?.publicId) await deleteFromCloudinary(item.pdfFile.publicId, 'raw');
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
