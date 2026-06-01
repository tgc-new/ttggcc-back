const mongoose = require('mongoose');
const routineSchema = new mongoose.Schema({
  title:    { type: String, default: 'রুটিন' },
  titleBn:  { type: String, default: '' },
  type:     { type: String, enum: ['class','exam','hsc','ssc','other'], default: 'class' },
  session:  { type: String },
  pdfFile:  { url: String, publicId: String, originalName: String },
  googleDriveLink: { type: String, default: '' },
  googleDriveFileName: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  publishDate: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model('Routine', routineSchema);
