import express from 'express';
import Gallery from '../models/Gallery.js';
import { uploadMultiple, deleteImage, generateOptimizedUrl } from '../utils/cloudinary.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/gallery - Get all active gallery images (public route)
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // Get images
    const images = await Gallery.find(query)
      .select('title description category imageUrl cloudinaryPublicId createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Get total count
    const totalImages = await Gallery.countDocuments(query);

    // Generate optimized URLs
    const optimizedImages = images.map(image => ({
      ...image,
      imageUrl: generateOptimizedUrl(image.cloudinaryPublicId, {
        width: 800,
        height: 600,
        crop: 'fill'
      })
    }));

    res.json({
      success: true,
      data: {
        images: optimizedImages,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalImages / limitNumber),
          totalImages,
          hasNextPage: pageNumber < Math.ceil(totalImages / limitNumber),
          hasPrevPage: pageNumber > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/gallery/admin - Get all gallery images for admin (with pagination and filters)
router.get('/admin', authenticate, adminOnly, async (req, res) => {
  try {
    const { 
      category, 
      search, 
      isActive, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get images with uploader details
    const images = await Gallery.find(query)
      .populate('uploadedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Get total count
    const totalImages = await Gallery.countDocuments(query);

    // Get category counts
    const categoryStats = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalImages / limitNumber),
          totalImages,
          hasNextPage: pageNumber < Math.ceil(totalImages / limitNumber),
          hasPrevPage: pageNumber > 1
        },
        stats: {
          totalImages: await Gallery.countDocuments(),
          activeImages: await Gallery.countDocuments({ isActive: true }),
          inactiveImages: await Gallery.countDocuments({ isActive: false }),
          categoryStats,
          storageUsed: await Gallery.aggregate([
            { $match: {} },
            { $group: { _id: null, totalSize: { $sum: '$metadata.fileSize' } } }
          ]).then(result => result[0]?.totalSize || 0)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/gallery/upload - Upload new images
router.post('/upload', authenticate, adminOnly, (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload images'
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images provided'
        });
      }

      // Parse image details from request body
      const imageDetails = JSON.parse(req.body.imageDetails || '[]');
      
      // Create gallery entries
      const galleryImages = [];
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const details = imageDetails[i] || {};
        
        const galleryImage = new Gallery({
          title: details.title || file.originalname.split('.')[0],
          description: details.description || '',
          category: details.category || 'Campus',
          imageUrl: file.path,
          cloudinaryPublicId: file.filename,
          uploadedBy: req.user.id,
          metadata: {
            originalFilename: file.originalname,
            fileSize: file.size,
            format: file.format,
            width: file.width,
            height: file.height
          }
        });

        await galleryImage.save();
        galleryImages.push(galleryImage);
      }

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${galleryImages.length} image(s)`,
        data: { images: galleryImages }
      });

    } catch (error) {
      console.error('Error saving gallery images:', error);
      
      // Clean up uploaded files if database save failed
      if (req.files) {
        for (const file of req.files) {
          try {
            await deleteImage(file.filename);
          } catch (deleteError) {
            console.error('Failed to cleanup uploaded file:', deleteError);
          }
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to save images',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

// PUT /api/gallery/:id - Update gallery image
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, description, category, isActive } = req.body;
    
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Update fields
    if (title !== undefined) image.title = title;
    if (description !== undefined) image.description = description;
    if (category !== undefined) image.category = category;
    if (isActive !== undefined) image.isActive = isActive;

    await image.save();

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: { image }
    });

  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/gallery/bulk - Delete multiple images
router.delete('/bulk', authenticate, adminOnly, async (req, res) => {
  try {
    const { imageIds } = req.body;
    
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image IDs provided'
      });
    }

    // Get images to delete
    const images = await Gallery.find({ _id: { $in: imageIds } });
    
    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No images found'
      });
    }

    // Delete from Cloudinary
    const deletePromises = images.map(image => deleteImage(image.cloudinaryPublicId));
    await Promise.all(deletePromises);
    
    // Delete from database
    await Gallery.deleteMany({ _id: { $in: imageIds } });

    res.json({
      success: true,
      message: `Successfully deleted ${images.length} image(s)`
    });

  } catch (error) {
    console.error('Error bulk deleting gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/gallery/:id - Delete single image
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from Cloudinary
    await deleteImage(image.cloudinaryPublicId);
    
    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/gallery/stats - Get gallery statistics
router.get('/admin/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const totalImages = await Gallery.countDocuments();
    const activeImages = await Gallery.countDocuments({ isActive: true });
    const inactiveImages = await Gallery.countDocuments({ isActive: false });
    
    const categoryStats = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentImages = await Gallery.find({ isActive: true })
      .select('title category createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalImages,
        activeImages,
        inactiveImages,
        categoryStats,
        recentImages
      }
    });

  } catch (error) {
    console.error('Error fetching gallery stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
