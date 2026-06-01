const express    = require('express');
const router     = express.Router();
const QuickLink  = require('../models/QuickLink');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = { isActive: true };
    if (section) filter.section = section;
    const links = await QuickLink.find(filter).sort({ order: 1 });
    res.json({ success: true, data: links });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const links = await QuickLink.find().sort({ section: 1, order: 1 });
    res.json({ success: true, data: links });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const link = await QuickLink.create(req.body);
    res.status(201).json({ success: true, data: link });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const link = await QuickLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: link });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await QuickLink.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/seed', protect, async (req, res) => {
  try {
    const count = await QuickLink.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded' });
    await QuickLink.insertMany([
      { label:'Ministry of Education',  labelBn:'শিক্ষা মন্ত্রণালয়',    url:'http://www.moedu.gov.bd',                   section:'important', order:1 },
      { label:'Notice Board',           labelBn:'নোটিশ বোর্ড',           url:'/notice',                                   section:'important', order:2, isExternal:false },
      { label:'Academic Calendar',      labelBn:'একাডেমিক ক্যালেন্ডার', url:'/academic',                                 section:'important', order:3, isExternal:false },
      { label:'Teachers',               labelBn:'শিক্ষকবৃন্দ',           url:'/teachers',                                 section:'important', order:4, isExternal:false },
      { label:'Contact',                labelBn:'যোগাযোগ',               url:'/contact',                                  section:'important', order:5, isExternal:false },
      { label:'EMIS | DSHE',            labelBn:'EMIS | DSHE',            url:'http://www.dshe.gov.bd',                    section:'important', order:6 },
      { label:'Results',                labelBn:'ফলাফল যাচাই',           url:'http://www.educationboardresults.gov.bd',   section:'important', order:7 },
      { label:'National University',    labelBn:'জাতীয় বিশ্ববিদ্যালয়', url:'http://www.nu.ac.bd',                       section:'important', order:8 },
      { label:'Home',            labelBn:'হোম',           url:'/',          section:'footer', order:1,  isExternal:false },
      { label:'About',           labelBn:'প্রতিষ্ঠান পরিচিতি', url:'/about', section:'footer', order:2, isExternal:false },
      { label:'Teachers',        labelBn:'শিক্ষকবৃন্দ',   url:'/teachers', section:'footer', order:3,  isExternal:false },
      { label:'Notice',          labelBn:'নোটিশ বোর্ড',   url:'/notice',   section:'footer', order:4,  isExternal:false },
      { label:'Gallery',         labelBn:'গ্যালারি',       url:'/gallery',  section:'footer', order:5,  isExternal:false },
      { label:'Committee',       labelBn:'পরিচালনা কমিটি', url:'/committee',section:'footer', order:6, isExternal:false },
      { label:'Contact',         labelBn:'যোগাযোগ',        url:'/contact',  section:'footer', order:7,  isExternal:false },
      { label:'Dhaka Board',     labelBn:'ঢাকা বোর্ড',    url:'http://www.dhakaeducationboard.gov.bd', section:'footer', order:8 },
      { label:'EMIS | DSHE',     labelBn:'EMIS | DSHE',   url:'http://www.dshe.gov.bd',                section:'footer', order:9 },
      { label:'National Info',   labelBn:'জাতীয় তথ্য বাতায়ন', url:'http://www.bangladesh.gov.bd',   section:'footer', order:10 },
    ]);
    res.json({ success: true, message: 'Links seeded' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
