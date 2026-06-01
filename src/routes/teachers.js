const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');
const { uploadTeacher, deleteFromCloudinary } = require('../config/cloudinary');

// @GET /api/teachers
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.employeeType = type;
    const teachers = await Teacher.find(filter).sort({ isPrincipal: -1, isVicePrincipal: -1, order: 1 });
    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/teachers/:id
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/teachers - Admin
router.post('/', protect, uploadTeacher.single('photo'), async (req, res) => {
  try {
    const teacherData = { ...req.body };
    if (req.file) {
      teacherData.photo = { url: req.file.path, publicId: req.file.filename };
    }
    const teacher = await Teacher.create(teacherData);
    res.status(201).json({ success: true, message: 'Teacher added', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/teachers/:id - Admin
router.put('/:id', protect, uploadTeacher.single('photo'), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    const updateData = { ...req.body };
    if (req.file) {
      if (teacher.photo?.publicId) await deleteFromCloudinary(teacher.photo.publicId);
      updateData.photo = { url: req.file.path, publicId: req.file.filename };
    }
    const updated = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Teacher updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @DELETE /api/teachers/:id - Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    if (teacher.photo?.publicId) await deleteFromCloudinary(teacher.photo.publicId);
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
