const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  nameBn:      { type: String },
  isActive:    { type: Boolean, default: false },
  // Colors
  primary:     { type: String, default: '#1a6b3c' },
  secondary:   { type: String, default: '#c41e3a' },
  accent:      { type: String, default: '#f5a623' },
  navBg:       { type: String, default: '#1a6b3c' },
  navText:     { type: String, default: '#ffffff' },
  topBarBg:    { type: String, default: '#0f3420' },
  heroOverlay: { type: String, default: 'rgba(0,0,0,0.45)' },
  cardBg:      { type: String, default: '#ffffff' },
  bodyBg:      { type: String, default: '#f8f9fa' },
  footerBg:    { type: String, default: '#111827' },
  sectionTitleBg: { type: String, default: '#1a6b3c' },
  btnPrimary:  { type: String, default: '#1a6b3c' },
  btnSecondary:{ type: String, default: '#c41e3a' },
  linkColor:   { type: String, default: '#1a6b3c' },
  // Shape / Style
  borderRadius:{ type: String, enum:['none','sm','md','lg','xl','full'], default:'md' },
  fontFamily:  { type: String, enum:['hind','noto','roboto','poppins'], default:'hind' },
  navStyle:    { type: String, enum:['solid','gradient','transparent','glassmorphism'], default:'solid' },
  cardStyle:   { type: String, enum:['flat','shadow','border','elevated'], default:'shadow' },
  sectionStyle:{ type: String, enum:['flat','rounded','wave','diagonal'], default:'flat' },
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);
