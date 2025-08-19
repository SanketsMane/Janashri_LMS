import express from 'express';
import User from '../models/User.js';
import { authenticate, studentOnly, adminOrSelf } from '../middleware/auth.js';
import { validateProfileUpdate } from '../middleware/validation.js';
import { sendSuccess, sendError, sanitizeInput, formatStudentDataForIdCard } from '../utils/helpers.js';
import { uploadPhoto, handleUploadError, deleteCloudinaryImage } from '../middleware/upload.js';

const router = express.Router();

// Get student profile
router.get('/profile', authenticate, studentOnly, async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    sendSuccess(res, student, 'Profile retrieved successfully');
    
  } catch (error) {
    console.error('Get student profile error:', error);
    sendError(res, 'Failed to get profile', 500);
  }
});

// Update student profile
router.put('/profile', authenticate, studentOnly, validateProfileUpdate, async (req, res) => {
  try {
    const { 
      name, 
      mobile, 
      bloodGroup, 
      standard, 
      dateOfBirth, 
      address, 
      emergencyContact 
    } = req.body;
    
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    // Update allowed fields with proper validation
    const updateData = {};
    
    if (name && name.trim()) updateData.name = sanitizeInput(name);
    if (mobile && mobile.trim()) {
      // Validate mobile number format
      if (!/^\d{10}$/.test(mobile.trim())) {
        return sendError(res, 'Mobile number must be 10 digits', 400);
      }
      updateData.mobile = mobile.trim();
    }
    if (bloodGroup && bloodGroup.trim()) updateData.bloodGroup = bloodGroup;
    if (standard && standard.trim()) updateData.standard = sanitizeInput(standard);
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (address && address.trim()) updateData.address = sanitizeInput(address);
    
    // Handle emergency contact with validation
    if (emergencyContact) {
      const emergencyContactData = {};
      if (emergencyContact.name && emergencyContact.name.trim()) {
        emergencyContactData.name = sanitizeInput(emergencyContact.name);
      }
      if (emergencyContact.relationship && emergencyContact.relationship.trim()) {
        emergencyContactData.relationship = sanitizeInput(emergencyContact.relationship);
      }
      if (emergencyContact.phone && emergencyContact.phone.trim()) {
        // Validate emergency contact phone
        if (!/^\d{10}$/.test(emergencyContact.phone.trim())) {
          return sendError(res, 'Emergency contact phone must be 10 digits', 400);
        }
        emergencyContactData.phone = emergencyContact.phone.trim();
      }
      
      // Only update emergency contact if at least one field is provided
      if (Object.keys(emergencyContactData).length > 0) {
        updateData.emergencyContact = {
          ...student.emergencyContact?.toObject?.() || {},
          ...emergencyContactData
        };
      }
    }
    
    // Update the student
    Object.assign(student, updateData);
    await student.save();
    
    // Return updated profile without password
    const updatedStudent = await User.findById(student._id).select('-password');
    
    sendSuccess(res, { user: updatedStudent }, 'Profile updated successfully');
    
  } catch (error) {
    console.error('Update student profile error:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendError(res, `Validation error: ${messages.join(', ')}`, 400);
    }
    
    sendError(res, 'Failed to update profile', 500);
  }
});

// Update student photo
router.put('/profile/photo', authenticate, studentOnly, uploadPhoto, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'Photo file is required', 400);
    }
    
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    // Delete old photo from Cloudinary if exists
    if (student.photo && student.photo.public_id) {
      try {
        await deleteCloudinaryImage(student.photo.public_id);
      } catch (deleteError) {
        console.error('Failed to delete old photo:', deleteError);
      }
    }
    
    // Update with new photo
    student.photo = {
      url: req.file.path,
      public_id: req.file.filename
    };
    
    await student.save();
    
    sendSuccess(res, {
      photo: student.photo
    }, 'Profile photo updated successfully');
    
  } catch (error) {
    console.error('Update student photo error:', error);
    sendError(res, 'Failed to update profile photo', 500);
  }
});

// Get student ID card data
router.get('/id-card', authenticate, studentOnly, async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    const idCardData = formatStudentDataForIdCard(student);
    
    sendSuccess(res, idCardData, 'ID card data retrieved successfully');
    
  } catch (error) {
    console.error('Get ID card data error:', error);
    sendError(res, 'Failed to get ID card data', 500);
  }
});

// Get student dashboard stats
router.get('/dashboard/stats', authenticate, studentOnly, async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    const stats = {
      profile: {
        completeness: calculateProfileCompleteness(student),
        lastUpdated: student.updatedAt,
        joinDate: student.createdAt,
        lastLogin: student.lastLogin
      },
      account: {
        status: student.isActive ? 'Active' : 'Inactive',
        studentId: student.student_id,
        email: student.email
      }
    };
    
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
    
  } catch (error) {
    console.error('Get student dashboard stats error:', error);
    sendError(res, 'Failed to get dashboard stats', 500);
  }
});

// Get student by ID (for admin or the student themselves)
router.get('/:studentId', authenticate, adminOrSelf, async (req, res) => {
  try {
    const student = await User.findOne({ 
      student_id: req.params.studentId,
      role: 'student' 
    }).select('-password');
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    sendSuccess(res, student, 'Student retrieved successfully');
    
  } catch (error) {
    console.error('Get student by ID error:', error);
    sendError(res, 'Failed to get student', 500);
  }
});

// Change password
router.put('/change-password', authenticate, studentOnly, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    // Verify current password
    const isMatch = await student.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', 400);
    }
    
    // Update password
    student.password = newPassword; // Will be hashed by pre-save middleware
    await student.save();
    
    sendSuccess(res, {}, 'Password changed successfully');
    
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 'Failed to change password', 500);
  }
});

// Update notification settings
router.put('/notification-settings', authenticate, studentOnly, async (req, res) => {
  try {
    const notificationSettings = req.body;
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    student.notificationSettings = notificationSettings;
    await student.save();
    
    sendSuccess(res, { notificationSettings }, 'Notification settings updated successfully');
    
  } catch (error) {
    console.error('Update notification settings error:', error);
    sendError(res, 'Failed to update notification settings', 500);
  }
});

// Update privacy settings
router.put('/privacy-settings', authenticate, studentOnly, async (req, res) => {
  try {
    const privacySettings = req.body;
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    student.privacySettings = privacySettings;
    await student.save();
    
    sendSuccess(res, { privacySettings }, 'Privacy settings updated successfully');
    
  } catch (error) {
    console.error('Update privacy settings error:', error);
    sendError(res, 'Failed to update privacy settings', 500);
  }
});

// Helper function to calculate profile completeness
function calculateProfileCompleteness(student) {
  const requiredFields = ['name', 'email', 'mobile', 'bloodGroup', 'standard', 'photo'];
  const completedFields = requiredFields.filter(field => {
    if (field === 'photo') {
      return student.photo && student.photo.url;
    }
    return student[field] && student[field].toString().trim() !== '';
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
}

export default router;
