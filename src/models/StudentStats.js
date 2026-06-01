const mongoose = require('mongoose');

const studentStatsSchema = new mongoose.Schema({
  academicYear: { type: String, required: true },
  classes: [{
    className: String,
    classNameBn: String,
    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  }],
  totalMale: { type: Number, default: 0 },
  totalFemale: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  isCurrent: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('StudentStats', studentStatsSchema);
