const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  titleBn: { type: String, trim: true },
  content: { type: String },
  category: {
    type: String,
    enum: ['academic', 'admission', 'exam', 'general', 'urgent', 'result'],
    default: 'general'
  },
  isScrolling:  { type: Boolean, default: false },
  isImportant:  { type: Boolean, default: false },
  isNewNotice:  { type: Boolean, default: true },

  // PDF file (Cloudinary upload)
  pdfFile: {
    url:          String,
    publicId:     String,
    originalName: String,
  },

  // Google Drive link (alternative to PDF upload)
  googleDriveLink: { type: String, default: '' },
  googleDriveFileName: { type: String, default: '' },

  publishDate: { type: Date, default: Date.now },
  expiryDate:  { type: Date },
  isActive:    { type: Boolean, default: true },
  views:       { type: Number, default: 0 },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
});

noticeSchema.index({ isActive: 1, publishDate: -1 });
noticeSchema.index({ category: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
