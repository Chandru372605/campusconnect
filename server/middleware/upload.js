const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusconnect',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

exports.uploadImages = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024, files: 4 }, // Max 3MB, 4 images
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed!'), false);
    }
    cb(null, true);
  }
}).array('images', 4);