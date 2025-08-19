import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Configure Cloudinary with explicit check
const configureCloudinary = () => {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
  
  console.log('Configuring Cloudinary with:', {
    cloud_name: config.cloud_name,
    api_key: config.api_key ? 'Present' : 'Missing',
    api_secret: config.api_secret ? 'Present' : 'Missing'
  });
  
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error('Missing Cloudinary credentials. Please check your .env file.');
  }
  
  cloudinary.config(config);
  return cloudinary;
};

// Initialize Cloudinary
const cloudinaryInstance = configureCloudinary();

// Configure Cloudinary storage for student photos
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInstance,
  params: {
    folder: 'lms/student-photos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'jpg'
      }
    ]
  },
});

// Configure Cloudinary storage for admission documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinaryInstance,
  params: {
    folder: 'lms/admission-documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto'
  },
});

// File filter function for images only
const imageFileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// File filter function for documents (images and PDFs)
const documentFileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG) and PDF files are allowed'), false);
  }
};

// Create multer upload middleware for single photo
export const uploadPhoto = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFileFilter,
}).single('photo');

// Create multer upload middleware for admission documents (multiple files)
export const uploadAdmissionDocuments = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files
  },
  fileFilter: documentFileFilter,
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'transferCertificate', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 }
]);

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPEG, PNG) are allowed.'
    });
  }
  
  if (err) {
    console.error('Upload error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed.'
    });
  }
  
  next();
};

// Utility function to delete image from Cloudinary
export const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export { cloudinary };
