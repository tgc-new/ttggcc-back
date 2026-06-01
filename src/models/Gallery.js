const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title:    { type: String, default: 'ছবি' },   // required সরানো হয়েছে
  titleBn:  { type: String, default: '' },
  image: {
    url:      { type: String, required: true },
    publicId: { type: String, required: true },
  },
  category: {
    type: String,
    enum: ['campus', 'event', 'sports', 'cultural', 'academic', 'other'],
    default: 'other',
  },
  isSlider:   { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  order:      { type: Number,  default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
