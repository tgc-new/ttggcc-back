const mongoose = require('mongoose');
const approvalSchema = new mongoose.Schema({
  title:    { type: String, default: 'অনুমোদন' },
  titleBn:  { type: String, default: '' },
  type:     { type: String, enum: ['recognition','approval','affiliation','other'], default: 'approval' },
  issueDate:{ type: Date },
  issuedBy: { type: String },
  description: { type: String },
  pdfFile: { url: String, publicId: String, originalName: String },
  googleDriveLink: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Approval', approvalSchema);
