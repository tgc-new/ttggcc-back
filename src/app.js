const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes          = require('./routes/auth');
const noticeRoutes        = require('./routes/notices');
const teacherRoutes       = require('./routes/teachers');
const galleryRoutes       = require('./routes/gallery');
const committeeRoutes     = require('./routes/committee');
const studentRoutes       = require('./routes/students');
const settingsRoutes      = require('./routes/settings');
const contactRoutes       = require('./routes/contact');
const approvalRoutes      = require('./routes/approvals');
const mpoRoutes           = require('./routes/mpo');
const routineRoutes       = require('./routes/routines');
const themeRoutes         = require('./routes/themes');
const navMenuRoutes       = require('./routes/navmenus');
const quickLinkRoutes     = require('./routes/quicklinks');
const scrollingTextRoutes = require('./routes/scrollingtexts');

connectDB();

const app = express();

const allowedOrigins = ['http://localhost:3000','http://localhost:3001','http://127.0.0.1:3000'];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (origin.includes('vercel.app') || origin.includes('render.com')) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS blocked: ' + origin), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
}));
app.options('*', cors());

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 500 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

app.use('/api/auth',           authRoutes);
app.use('/api/notices',        noticeRoutes);
app.use('/api/teachers',       teacherRoutes);
app.use('/api/gallery',        galleryRoutes);
app.use('/api/committee',      committeeRoutes);
app.use('/api/students',       studentRoutes);
app.use('/api/settings',       settingsRoutes);
app.use('/api/contact',        contactRoutes);
app.use('/api/approvals',      approvalRoutes);
app.use('/api/mpo',            mpoRoutes);
app.use('/api/routines',       routineRoutes);
app.use('/api/themes',         themeRoutes);
app.use('/api/navmenus',       navMenuRoutes);
app.use('/api/quicklinks',     quickLinkRoutes);
app.use('/api/scrollingtexts', scrollingTextRoutes);

app.get('/api/health', (_req, res) => res.json({ status:'OK', time: new Date() }));

app.use((err, _req, res, _next) => {
  console.error('❌', err.message);
  res.status(err.statusCode||500).json({ success:false, message: err.message||'Server Error' });
});
app.use('*', (req, res) => res.status(404).json({ success:false, message:`${req.originalUrl} not found` }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server on port ${PORT}`);
  console.log(`🌐 CORS: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
