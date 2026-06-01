const express = require('express');
const router  = express.Router();
const Theme   = require('../models/Theme');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: 1 });
    res.json({ success: true, data: themes });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/active', async (req, res) => {
  try {
    let theme = await Theme.findOne({ isActive: true });
    if (!theme) theme = await Theme.findOne();
    res.json({ success: true, data: theme });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/activate/:id', protect, async (req, res) => {
  try {
    await Theme.updateMany({}, { isActive: false });
    const theme = await Theme.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!theme) return res.status(404).json({ success: false, message: 'Theme not found' });
    res.json({ success: true, message: 'Theme activated', data: theme });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!theme) return res.status(404).json({ success: false, message: 'Theme not found' });
    res.json({ success: true, data: theme });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/seed', protect, async (req, res) => {
  try {
    const count = await Theme.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Themes already seeded' });
    await Theme.insertMany(getDefaultThemes());
    res.json({ success: true, message: 'Default themes seeded' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;

function getDefaultThemes() {
  return [
    { name:'Forest Green',   nameBn:'ফরেস্ট গ্রিন',    primary:'#1a6b3c', secondary:'#c41e3a', accent:'#f5a623', navBg:'#1a6b3c', topBarBg:'#0f3420', footerBg:'#111827', bodyBg:'#f8f9fa', cardBg:'#ffffff', sectionTitleBg:'#1a6b3c', btnPrimary:'#1a6b3c', linkColor:'#1a6b3c', borderRadius:'md',  navStyle:'solid',         cardStyle:'shadow',   isActive:true  },
    { name:'Royal Blue',     nameBn:'রয়্যাল ব্লু',     primary:'#1e40af', secondary:'#dc2626', accent:'#f59e0b', navBg:'#1e3a8a', topBarBg:'#1e3a8a', footerBg:'#0f172a', bodyBg:'#f0f4ff', cardBg:'#ffffff', sectionTitleBg:'#1e40af', btnPrimary:'#1e40af', linkColor:'#1e40af', borderRadius:'lg',  navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Deep Purple',    nameBn:'ডিপ পার্পেল',     primary:'#7c3aed', secondary:'#db2777', accent:'#f59e0b', navBg:'#5b21b6', topBarBg:'#4c1d95', footerBg:'#1e1b4b', bodyBg:'#faf5ff', cardBg:'#ffffff', sectionTitleBg:'#7c3aed', btnPrimary:'#7c3aed', linkColor:'#7c3aed', borderRadius:'xl',  navStyle:'gradient',      cardStyle:'elevated' },
    { name:'Crimson Red',    nameBn:'ক্রিমসন রেড',     primary:'#b91c1c', secondary:'#1d4ed8', accent:'#d97706', navBg:'#991b1b', topBarBg:'#7f1d1d', footerBg:'#111827', bodyBg:'#fff5f5', cardBg:'#ffffff', sectionTitleBg:'#b91c1c', btnPrimary:'#b91c1c', linkColor:'#b91c1c', borderRadius:'sm',  navStyle:'solid',         cardStyle:'border'   },
    { name:'Ocean Teal',     nameBn:'ওশেন টিল',        primary:'#0f766e', secondary:'#7c3aed', accent:'#f59e0b', navBg:'#115e59', topBarBg:'#134e4a', footerBg:'#042f2e', bodyBg:'#f0fdfa', cardBg:'#ffffff', sectionTitleBg:'#0f766e', btnPrimary:'#0f766e', linkColor:'#0f766e', borderRadius:'md',  navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Sunset Orange',  nameBn:'সানসেট অরেঞ্জ',   primary:'#c2410c', secondary:'#1d4ed8', accent:'#fbbf24', navBg:'#9a3412', topBarBg:'#7c2d12', footerBg:'#1c1917', bodyBg:'#fff7ed', cardBg:'#ffffff', sectionTitleBg:'#c2410c', btnPrimary:'#c2410c', linkColor:'#c2410c', borderRadius:'lg',  navStyle:'gradient',      cardStyle:'elevated' },
    { name:'Midnight Navy',  nameBn:'মিডনাইট নেভি',   primary:'#1e3a5f', secondary:'#b45309', accent:'#fbbf24', navBg:'#162d4a', topBarBg:'#0f1e33', footerBg:'#0a0f1a', bodyBg:'#eef2ff', cardBg:'#ffffff', sectionTitleBg:'#1e3a5f', btnPrimary:'#1e3a5f', linkColor:'#1e3a5f', borderRadius:'none',navStyle:'solid',         cardStyle:'flat'     },
    { name:'Rose Gold',      nameBn:'রোজ গোল্ড',       primary:'#be185d', secondary:'#0369a1', accent:'#d97706', navBg:'#9d174d', topBarBg:'#831843', footerBg:'#1f2937', bodyBg:'#fff1f2', cardBg:'#ffffff', sectionTitleBg:'#be185d', btnPrimary:'#be185d', linkColor:'#be185d', borderRadius:'full',navStyle:'gradient',      cardStyle:'elevated' },
    { name:'Dark Mode',      nameBn:'ডার্ক মোড',        primary:'#6366f1', secondary:'#ec4899', accent:'#fbbf24', navBg:'#18181b', topBarBg:'#09090b', footerBg:'#09090b', bodyBg:'#1c1c1e', cardBg:'#27272a', sectionTitleBg:'#3f3f46', btnPrimary:'#6366f1', linkColor:'#818cf8', borderRadius:'md',  navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Emerald Fresh',  nameBn:'এমারেল্ড ফ্রেশ',  primary:'#059669', secondary:'#7c3aed', accent:'#fbbf24', navBg:'#047857', topBarBg:'#065f46', footerBg:'#022c22', bodyBg:'#ecfdf5', cardBg:'#ffffff', sectionTitleBg:'#059669', btnPrimary:'#059669', linkColor:'#059669', borderRadius:'xl',  navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Sky Blue',       nameBn:'স্কাই ব্লু',       primary:'#0284c7', secondary:'#dc2626', accent:'#f59e0b', navBg:'#0369a1', topBarBg:'#075985', footerBg:'#082f49', bodyBg:'#f0f9ff', cardBg:'#ffffff', sectionTitleBg:'#0284c7', btnPrimary:'#0284c7', linkColor:'#0284c7', borderRadius:'md',  navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Warm Brown',     nameBn:'ওয়ার্ম ব্রাউন',   primary:'#92400e', secondary:'#1e40af', accent:'#fbbf24', navBg:'#78350f', topBarBg:'#451a03', footerBg:'#1c1917', bodyBg:'#fef3c7', cardBg:'#fffbeb', sectionTitleBg:'#92400e', btnPrimary:'#92400e', linkColor:'#92400e', borderRadius:'sm',  navStyle:'solid',         cardStyle:'border'   },
    { name:'Lavender',       nameBn:'ল্যাভেন্ডার',      primary:'#6d28d9', secondary:'#0891b2', accent:'#f59e0b', navBg:'#5b21b6', topBarBg:'#4c1d95', footerBg:'#1e1b4b', bodyBg:'#f5f3ff', cardBg:'#ffffff', sectionTitleBg:'#6d28d9', btnPrimary:'#6d28d9', linkColor:'#6d28d9', borderRadius:'xl',  navStyle:'glassmorphism', cardStyle:'elevated' },
    { name:'Bangladesh Green',nameBn:'বাংলাদেশ গ্রিন', primary:'#006a4e', secondary:'#f42a41', accent:'#ffd700', navBg:'#006a4e', topBarBg:'#004d38', footerBg:'#001a13', bodyBg:'#f0fdf4', cardBg:'#ffffff', sectionTitleBg:'#006a4e', btnPrimary:'#006a4e', linkColor:'#006a4e', borderRadius:'md',  navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Slate Gray',     nameBn:'স্লেট গ্রে',       primary:'#475569', secondary:'#0891b2', accent:'#f59e0b', navBg:'#334155', topBarBg:'#1e293b', footerBg:'#0f172a', bodyBg:'#f8fafc', cardBg:'#ffffff', sectionTitleBg:'#475569', btnPrimary:'#475569', linkColor:'#475569', borderRadius:'md',  navStyle:'solid',         cardStyle:'flat'     },
    { name:'Coral Reef',     nameBn:'কোরাল রিফ',       primary:'#e11d48', secondary:'#0284c7', accent:'#fbbf24', navBg:'#be123c', topBarBg:'#9f1239', footerBg:'#1f2937', bodyBg:'#fff1f2', cardBg:'#ffffff', sectionTitleBg:'#e11d48', btnPrimary:'#e11d48', linkColor:'#e11d48', borderRadius:'lg',  navStyle:'gradient',      cardStyle:'elevated' },
    { name:'Forest Night',   nameBn:'ফরেস্ট নাইট',    primary:'#166534', secondary:'#854d0e', accent:'#a3e635', navBg:'#14532d', topBarBg:'#052e16', footerBg:'#052e16', bodyBg:'#f0fdf4', cardBg:'#ffffff', sectionTitleBg:'#166534', btnPrimary:'#166534', linkColor:'#166534', borderRadius:'none',navStyle:'solid',         cardStyle:'shadow'   },
    { name:'Gold & Black',   nameBn:'গোল্ড এন্ড ব্ল্যাক',primary:'#b45309',secondary:'#1f2937', accent:'#fbbf24', navBg:'#1c1917', topBarBg:'#0c0a09', footerBg:'#0c0a09', bodyBg:'#fefce8', cardBg:'#ffffff', sectionTitleBg:'#b45309', btnPrimary:'#b45309', linkColor:'#b45309', borderRadius:'sm',  navStyle:'solid',         cardStyle:'border'   },
    { name:'Indigo Wave',    nameBn:'ইন্ডিগো ওয়েভ',   primary:'#4338ca', secondary:'#0891b2', accent:'#f59e0b', navBg:'#3730a3', topBarBg:'#312e81', footerBg:'#1e1b4b', bodyBg:'#eef2ff', cardBg:'#ffffff', sectionTitleBg:'#4338ca', btnPrimary:'#4338ca', linkColor:'#4338ca', borderRadius:'xl',  navStyle:'wave',          cardStyle:'elevated' },
    { name:'Mint Fresh',     nameBn:'মিন্ট ফ্রেশ',     primary:'#0d9488', secondary:'#7c3aed', accent:'#fbbf24', navBg:'#0f766e', topBarBg:'#134e4a', footerBg:'#022c22', bodyBg:'#f0fdfa', cardBg:'#ffffff', sectionTitleBg:'#0d9488', btnPrimary:'#0d9488', linkColor:'#0d9488', borderRadius:'full',navStyle:'gradient',      cardStyle:'shadow'   },
  ];
}
