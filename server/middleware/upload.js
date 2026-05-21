const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { memoryStorage } = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage (Marketplace, LostFound)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusconnect/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// PDF/file upload to memory (Notes — streamed manually to Cloudinary raw)
const pdfMemory = memoryStorage();

exports.uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 3 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed!'), false);
    }
    cb(null, true);
  }
}).array('images', 4);

exports.uploadPDF = multer({
  storage: pdfMemory,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed!'), false);
    }
    cb(null, true);
  }
}).single('file');