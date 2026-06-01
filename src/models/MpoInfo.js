const mongoose = require('mongoose');
const mpoSchema = new mongoose.Schema({
  mpoNumber:    { type: String },
  mpoDate:      { type: Date },
  mpoStatus:    { type: String, enum: ['active','inactive','pending'], default: 'active' },
  description:  { type: String },
  documents: [{
    title: String,
    pdfFile: { url: String, publicId: String },
    googleDriveLink: String,
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('MpoInfo', mpoSchema);
