const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String },
  designation: { type: String, required: true },
  designationBn: { type: String },
  department: { type: String },
  qualification: { type: String },
  experience: { type: String },
  phone: { type: String },
  email: { type: String },
  photo: {
    url: { type: String, default: '' },
    publicId: String,
  },
  employeeType: {
    type: String,
    enum: ['mpo', 'non-mpo', 'part-time'],
    default: 'mpo'
  },
  joinDate: { type: Date },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

staffSchema.index({ order: 1 });

module.exports = mongoose.model('Staff', staffSchema);
