const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ক্লাউডিনারি কনফিগারেশন (আপনার প্রজেক্টের আসল কি বা চাবি)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dtb2lqquw',
  api_key: process.env.CLOUDINARY_API_KEY || '689255767227749',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'g3rZ8-Vj11aZkW_cMwM_M_xQ-l0'
});

// সাধারণ ইমেজ আপলোডের স্টোরেজ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tungipara-college',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// পিডিএফ আপলোডের জন্য বিশেষ ও সঠিক স্টোরেজ
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tungipara-college/pdfs',
    resource_type: 'auto', // এই লাইনটি নিশ্চিত করবে ফাইলটি যেন র ফাইল বা ইমেজ না হয়ে আসল পিডিএফ হিসেবেই সেভ হয়
    flags: 'attachment'
  },
});

const uploadImg = multer({ storage: storage });
const uploadPDF = multer({ storage: pdfStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = {
  cloudinary,
  uploadImg,
  uploadPDF
};
