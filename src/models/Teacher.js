const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String },
  designation: { type: String, required: true },
  designationBn: { type: String },
  department: { type: String },
  subject: { type: String },
  qualification: { type: String },
  bcsBatch: { type: String }, // BCS ব্যাচ নম্বর — ঐচ্ছিক (optional)
  experience: { type: String },
  phone: { type: String },
  email: { type: String },
  photo: {
    url: { type: String, default: '' },
    publicId: String,
  },
  isPrincipal: { type: Boolean, default: false },
  isVicePrincipal: { type: Boolean, default: false },
  employeeType: {
    type: String,
    enum: ['mpo', 'non-mpo', 'part-time'],
    default: 'mpo'
  },
  joinDate: { type: Date },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

teacherSchema.index({ order: 1, isPrincipal: -1 });

module.exports = mongoose.model('Teacher', teacherSchema);
