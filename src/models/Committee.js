const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String },
  designation: { type: String, required: true },
  designationBn: { type: String },
  type: {
    type: String,
    enum: ['chairman', 'member', 'secretary', 'treasurer'],
    default: 'member'
  },
  phone: { type: String },
  email: { type: String },
  photo: {
    url: { type: String, default: '' },
    publicId: String,
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Committee', committeeSchema);
