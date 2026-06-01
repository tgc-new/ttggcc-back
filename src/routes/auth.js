const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin    = require('../models/Admin');
const { protect } = require('../middleware/auth');

// ─── Token helper ──────────────────────────────────
const generateToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '365d',   // ডিফল্ট 365 দিন
  });

// ─── Login ─────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min:6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors:errors.array() });

    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, isActive:true });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success:false, message:'ইমেইল বা পাসওয়ার্ড ভুল' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);
    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      admin: { id:admin._id, name:admin.name, email:admin.email, role:admin.role },
    });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

// ─── Me ────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success:true, admin:req.admin });
});

// ─── Change My Password ────────────────────────────
router.post('/change-password', protect, [
  body('currentPassword').isLength({ min:6 }),
  body('newPassword').isLength({ min:6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors:errors.array() });

    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ success:false, message:'বর্তমান পাসওয়ার্ড ভুল' });
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ success:true, message:'পাসওয়ার্ড পরিবর্তন হয়েছে' });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

// ─── Seed first admin (run once) ──────────────────
router.post('/seed', async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) return res.json({ success:true, message:'Admin already exists' });

    const admin = await Admin.create({
      name:     'Super Admin',
      email:    process.env.ADMIN_EMAIL    || 'admin@malkhanagarcollege.edu.bd',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role:     'superadmin',
    });
    res.json({ success:true, message:'Admin created', admin:{ id:admin._id, email:admin.email } });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

// ══════════════════════════════════════════════════
//  Admin Management (superadmin only)
// ══════════════════════════════════════════════════

// @GET /api/auth/admins
router.get('/admins', protect, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt:-1 });
    res.json({ success:true, data:admins });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

// @POST /api/auth/admins — নতুন admin তৈরি
router.post('/admins', protect, [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min:6 }),
], async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin')
      return res.status(403).json({ success:false, message:'শুধুমাত্র Super Admin নতুন Admin তৈরি করতে পারবেন' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors:errors.array() });

    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ success:false, message:'এই ইমেইলে আগেই Admin আছে' });

    const admin = await Admin.create({ name, email, password, role: role||'admin' });
    res.status(201).json({
      success:true, message:'নতুন Admin তৈরি হয়েছে',
      data:{ id:admin._id, name:admin.name, email:admin.email, role:admin.role },
    });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

// @PATCH /api/auth/admins/:id/toggle
router.patch('/admins/:id/toggle', protect, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin') return res.status(403).json({ success:false, message:'অনুমতি নেই' });
    if (req.params.id === req.admin._id.toString())
      return res.status(400).json({ success:false, message:'নিজেকে নিষ্ক্রিয় করা যাবে না' });

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success:false, message:'Admin পাওয়া যায়নি' });
    admin.isActive = !admin.isActive;
    await admin.save();
    res.json({ success:true, message:`Admin ${admin.isActive?'সক্রিয়':'নিষ্ক্রিয়'} করা হয়েছে`, data:admin });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

// @PATCH /api/auth/admins/:id/reset-password
router.patch('/admins/:id/reset-password', protect, [
  body('newPassword').isLength({ min:6 }),
], async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin')
      return res.status(403).json({ success:false, message:'শুধুমাত্র Super Admin password reset করতে পারবেন' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors:errors.array() });

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success:false, message:'Admin পাওয়া যায়নি' });
    admin.password = req.body.newPassword;
    await admin.save();
    res.json({ success:true, message:`${admin.name}-এর পাসওয়ার্ড রিসেট হয়েছে` });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

// @DELETE /api/auth/admins/:id
router.delete('/admins/:id', protect, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin') return res.status(403).json({ success:false, message:'অনুমতি নেই' });
    if (req.params.id === req.admin._id.toString())
      return res.status(400).json({ success:false, message:'নিজেকে ডিলিট করা যাবে না' });

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success:false, message:'Admin পাওয়া যায়নি' });
    if (admin.role === 'superadmin')
      return res.status(400).json({ success:false, message:'Super Admin-কে ডিলিট করা যাবে না' });

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:'Admin ডিলিট হয়েছে' });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

// @PATCH /api/auth/admins/:id/update
router.patch('/admins/:id/update', protect, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin') return res.status(403).json({ success:false, message:'অনুমতি নেই' });
    const { name, email, role } = req.body;
    const admin = await Admin.findByIdAndUpdate(req.params.id, { name, email, role }, { new:true, runValidators:true }).select('-password');
    if (!admin) return res.status(404).json({ success:false, message:'Admin পাওয়া যায়নি' });
    res.json({ success:true, message:'Admin আপডেট হয়েছে', data:admin });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

module.exports = router;
