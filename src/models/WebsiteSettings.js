const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema({
  collegeName: { type: String, default: 'প্রতিষ্ঠানের নাম' },
  collegeNameEn: { type: String, default: 'Institution Name' },
  tagline: { type: String, default: 'জ্ঞানই শক্তি' },
  eiinNumber: { type: String, default: '' },
  mpoNumber: { type: String },
  establishedYear: { type: String, default: '' },
  address: { type: String, default: 'প্রতিষ্ঠানের ঠিকানা' },
  addressEn: { type: String, default: 'Institution Address' },
  phone: [{ type: String }],
  email: { type: String },
  website: { type: String },
  logo: {
    url: { type: String, default: '' },
    publicId: String,
  },
  favicon: {
    url: { type: String, default: '' },
    publicId: String,
  },
  principalName: { type: String },
  principalNameBn: { type: String },
  principalDesignation: { type: String, default: 'অধ্যক্ষ' },
  principalMessage: { type: String },
  principalPhoto: {
    url: { type: String, default: '' },
    publicId: String,
  },
  chairmanName: { type: String },
  chairmanNameBn: { type: String },
  chairmanDesignation: { type: String, default: 'অধ্যক্ষ (ভারপ্রাপ্ত)' },
  chairmanMessage: { type: String },
  chairmanPhoto: {
    url: { type: String, default: '' },
    publicId: String,
  },
  socialLinks: {
    facebook: String,
    youtube: String,
    twitter: String,
    instagram: String,
  },
  googleMapEmbed: { type: String },
  footerText: { type: String, default: 'All rights reserved © 2026, Madrasha Darul Quran' },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  scrollingNotice: { type: String },
  isScrollingActive: { type: Boolean, default: true },
  aboutHistory: { type: String },
  visionMission: { type: String },
  objectives: { type: String },
  appStoreLink: { type: String },
  playStoreLink: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
