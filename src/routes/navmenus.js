const express = require('express');
const router  = express.Router();
const NavMenu = require('../models/NavMenu');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const menus = await NavMenu.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: menus });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const menus = await NavMenu.find().sort({ order: 1 });
    res.json({ success: true, data: menus });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const menu = await NavMenu.create(req.body);
    res.status(201).json({ success: true, data: menu });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const menu = await NavMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ success: false, message: 'Menu not found' });
    res.json({ success: true, data: menu });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await NavMenu.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/reorder', protect, async (req, res) => {
  try {
    const { orders } = req.body; // [{id, order}]
    await Promise.all(orders.map(({ id, order }) =>
      NavMenu.findByIdAndUpdate(id, { order })
    ));
    res.json({ success: true, message: 'Reordered' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/seed', protect, async (req, res) => {
  try {
    const count = await NavMenu.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded' });
    await NavMenu.insertMany([
      { label:'Home',    labelBn:'হোম',    href:'/',        order:1 },
      { label:'About',   labelBn:'প্রতিষ্ঠান পরিচিতি', href:'/about', order:2, children:[
        { label:'History',    labelBn:'ইতিহাস',        href:'/about',            order:1 },
        { label:'Objectives', labelBn:'লক্ষ্য ও উদ্দেশ্য', href:'/about#objectives', order:2 },
        { label:'Vision',     labelBn:'ভিশন ও মিশন',    href:'/about#vision',     order:3 },
        { label:"Principal",  labelBn:'সভাপতির বাণী',   href:'/about#principal',  order:4 },
      ]},
      { label:'Academic', labelBn:'একাডেমিক', href:'/academic', order:3, children:[
        { label:'Routine',   labelBn:'রুটিন',          href:'/exam',     order:1 },
        { label:'Syllabus',  labelBn:'পাঠ পরিকল্পনা', href:'/academic', order:2 },
        { label:'Calendar',  labelBn:'একাডেমিক ক্যালেন্ডার', href:'/academic#calendar', order:3 },
      ]},
      { label:'Administration', labelBn:'প্রশাসন', href:'#', order:4, children:[
        { label:'Teachers',  labelBn:'শিক্ষকবৃন্দ',   href:'/teachers',  order:1 },
        { label:'Committee', labelBn:'পরিচালনা কমিটি', href:'/committee', order:2 },
        { label:'Approvals', labelBn:'অনুমোদন',        href:'/approvals', order:3 },
        { label:'MPO',       labelBn:'MPO তথ্য',        href:'/mpo',       order:4 },
      ]},
      { label:'Admission', labelBn:'ভর্তি',   href:'/admission', order:5 },
      { label:'Gallery',   labelBn:'গ্যালারি', href:'/gallery',   order:6 },
      { label:'Exam',      labelBn:'পরীক্ষা',  href:'/exam',      order:7 },
      { label:'Notice',    labelBn:'নোটিশ',    href:'/notice',    order:8 },
      { label:'Contact',   labelBn:'যোগাযোগ',  href:'/contact',   order:9 },
    ]);
    res.json({ success: true, message: 'Seeded default nav' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
