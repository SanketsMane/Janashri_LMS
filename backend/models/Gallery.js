import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    trim: true,
    maxLength: 500
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Campus', 'Facilities', 'Sports', 'Events', 'Students', 'Faculty'],
    default: 'Campus'
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  cloudinaryPublicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    originalFilename: String,
    fileSize: Number,
    format: String,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
gallerySchema.index({ category: 1, isActive: 1 });
gallerySchema.index({ createdAt: -1 });

export default mongoose.model('Gallery', gallerySchema);
