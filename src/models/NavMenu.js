const mongoose = require('mongoose');

const navMenuSchema = new mongoose.Schema({
  label:    { type: String, required: true },
  labelBn:  { type: String, required: true },
  href:     { type: String, default: '#' },
  order:    { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isExternal: { type: Boolean, default: false },
  children: [{
    label:    String,
    labelBn:  String,
    href:     { type: String, default: '#' },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isExternal: { type: Boolean, default: false },
  }],
}, { timestamps: true });

module.exports = mongoose.model('NavMenu', navMenuSchema);
