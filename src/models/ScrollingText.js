const mongoose = require('mongoose');

const scrollingTextSchema = new mongoose.Schema({
  text:     { type: String, required: true },
  order:    { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  color:    { type: String, default: '#1a1a1a' },
}, { timestamps: true });

module.exports = mongoose.model('ScrollingText', scrollingTextSchema);
