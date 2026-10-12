const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tungipara-college/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// PDF storage (Fixed download issue)
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tungipara-college/pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'auto',
  },
});

// Teacher photo storage
const teacherStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tungipara-college/teachers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 500, crop: 'fill', quality: 'auto' }],
  },
});

// Staff photo storage
const staffStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tungipara-college/staff',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 500, crop: 'fill', quality: 'auto' }],
  },
});

const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadPDF = multer({ storage: pdfStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadTeacher = multer({ storage: teacherStorage, limits: { fileSize: 3 * 1024 * 1024 } });
const uploadStaff = multer({ storage: staffStorage, limits: { fileSize: 3 * 1024 * 1024 } });

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = { cloudinary, uploadImage, uploadPDF, uploadTeacher, uploadStaff, deleteFromCloudinary };
