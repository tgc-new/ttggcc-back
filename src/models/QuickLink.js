const mongoose = require('mongoose');

const quickLinkSchema = new mongoose.Schema({
  label:      { type: String, required: true },
  labelBn:    { type: String },
  url:        { type: String, required: true },
  section:    { type: String, enum:['important','footer','home'], default:'important' },
  icon:       { type: String, default: 'FaLink' },
  isExternal: { type: Boolean, default: true },
  order:      { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('QuickLink', quickLinkSchema);
