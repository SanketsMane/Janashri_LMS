import express from 'express';
import mongoose from 'mongoose';
import Admission from '../models/Admission.js';
import { uploadAdmissionDocuments, handleUploadError } from '../middleware/upload.js';
import { sendSuccess, sendError, sanitizeInput } from '../utils/helpers.js';
import fallbackStorage from '../fallback-storage.js';

const router = express.Router();

// Submit admission form
router.post('/submit', (req, res, next) => {
  uploadAdmissionDocuments(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      // Don't fail if no files are uploaded, just continue
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || (err.message && err.message.includes('no files'))) {
        console.log('No files uploaded, continuing...');
        next();
      } else {
        return res.status(400).json({
          success: false,
          message: 'File upload failed.',
          error: err.message
        });
      }
    } else {
      next();
    }
  });
}, async (req, res) => {
  try {
    console.log('=== ADMISSION SUBMISSION START ===');
    console.log('Request body fields:', Object.keys(req.body));
    console.log('Form data received:', req.body);
    console.log('Files uploaded:', req.files);
    console.log('=== DATA VALIDATION ===');
    
    // Extract form data
    const {
      firstName, lastName, dateOfBirth, gender, bloodGroup, nationality,
      email, phone, alternatePhone, address, city, state, pincode,
      course, previousSchool, previousPercentage, boardOfStudy, yearOfPassing,
      fatherName, fatherOccupation, motherName, motherOccupation, guardianPhone,
      extracurricular, medicalHistory, specialRequirements
    } = req.body;
    
    // Log individual required field values
    console.log('Required fields check:');
    console.log('- firstName:', firstName);
    console.log('- lastName:', lastName);
    console.log('- email:', email);
    console.log('- phone:', phone);
    console.log('- dateOfBirth:', dateOfBirth);
    console.log('- gender:', gender);
    console.log('- bloodGroup:', bloodGroup);
    console.log('- address:', address);
    console.log('- city:', city);
    console.log('- state:', state);
    console.log('- pincode:', pincode);
    console.log('- course:', course);
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      console.log('❌ Missing basic required fields');
      return sendError(res, 'Missing required fields: firstName, lastName, email, or phone', 400);
    }
    
    // Sanitize inputs
    const sanitizedData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: sanitizeInput(gender),
      bloodGroup: sanitizeInput(bloodGroup),
      nationality: sanitizeInput(nationality),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone?.trim(),
      address: sanitizeInput(address),
      city: sanitizeInput(city),
      state: sanitizeInput(state),
      pincode: pincode?.trim(),
      course: sanitizeInput(course),
      previousSchool: sanitizeInput(previousSchool),
      previousPercentage: previousPercentage ? parseFloat(previousPercentage) : undefined,
      boardOfStudy: sanitizeInput(boardOfStudy),
      yearOfPassing: yearOfPassing ? parseInt(yearOfPassing) : undefined,
      fatherName: sanitizeInput(fatherName),
      fatherOccupation: sanitizeInput(fatherOccupation),
      motherName: sanitizeInput(motherName),
      motherOccupation: sanitizeInput(motherOccupation),
      guardianPhone: guardianPhone?.trim(),
      extracurricular: sanitizeInput(extracurricular),
      medicalHistory: sanitizeInput(medicalHistory),
      specialRequirements: sanitizeInput(specialRequirements)
    };
    
    // Process uploaded files (optional)
    const documents = [];
    if (req.files && Object.keys(req.files).length > 0) {
      // Handle multiple files from different fields
      Object.keys(req.files).forEach(fieldName => {
        const filesArray = req.files[fieldName];
        if (filesArray && Array.isArray(filesArray)) {
          filesArray.forEach(file => {
            documents.push({
              type: fieldName, // photo, marksheet, etc.
              url: file.path,
              public_id: file.filename,
              name: file.originalname
            });
          });
        } else if (filesArray) {
          // Single file
          documents.push({
            type: fieldName,
            url: filesArray.path,
            public_id: filesArray.filename,
            name: filesArray.originalname
          });
        }
      });
    } else if (req.file) {
      // Single file upload (backward compatibility)
      documents.push({
        type: 'photo',
        url: req.file.path,
        public_id: req.file.filename,
        name: req.file.originalname
      });
    }
    
    // Documents are optional for now
    sanitizedData.documents = documents;
    
    let admission;
    
    // Try MongoDB first, fallback to local storage if DB is not available
    if (mongoose.connection.readyState === 1) {
      // Check if email already exists in MongoDB
      const existingApplication = await Admission.findOne({ email: sanitizedData.email });
      if (existingApplication) {
        return sendError(res, 'An application with this email already exists', 400);
      }
      
      // Create new admission application in MongoDB
      admission = new Admission(sanitizedData);
      await admission.save();
    } else {
      // Use fallback storage
      console.log('Using fallback storage - database not available');
      
      // Check if email already exists in fallback storage
      const existingApplications = fallbackStorage.getAllAdmissions();
      const existingApplication = existingApplications.find(app => app.email === sanitizedData.email);
      if (existingApplication) {
        return sendError(res, 'An application with this email already exists', 400);
      }
      
      // Create new admission application in fallback storage
      sanitizedData.submittedAt = new Date();
      admission = fallbackStorage.saveAdmission(sanitizedData);
    }

    sendSuccess(res, {
      applicationId: admission._id,
      submittedAt: admission.submittedAt || admission.createdAt,
      status: admission.status
    }, 'Admission application submitted successfully', 201);
    
  } catch (error) {
    console.error('Admission submission error:', error);
    
    if (error.code === 11000) {
      return sendError(res, 'An application with this email already exists', 400);
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return sendError(res, `Validation error: ${errors.join(', ')}`, 400);
    }
    
    sendError(res, 'Failed to submit application', 500);
  }
});

// Get admission application status (public - by email)
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email || !email.includes('@')) {
      return sendError(res, 'Please provide a valid email address', 400);
    }
    
    const admission = await Admission.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('status submittedAt processedAt student_id');
    
    if (!admission) {
      return sendError(res, 'No admission application found for this email', 404);
    }
    
    const responseData = {
      status: admission.status,
      submittedAt: admission.submittedAt,
      processedAt: admission.processedAt
    };
    
    // Only include student_id if status is Accepted
    if (admission.status === 'Accepted' && admission.student_id) {
      responseData.student_id = admission.student_id;
    }
    
    sendSuccess(res, responseData, 'Admission status retrieved successfully');
    
  } catch (error) {
    console.error('Get admission status error:', error);
    sendError(res, 'Failed to get admission status', 500);
  }
});

// Get admission statistics (public)
router.get('/stats', async (req, res) => {
  try {
    let stats;
    
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      const dbStats = await Admission.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const formattedStats = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0
      };
      
      dbStats.forEach(stat => {
        formattedStats.total += stat.count;
        formattedStats[stat._id.toLowerCase()] = stat.count;
      });
      
      // Get recent applications count (last 30 days)
      const recentApplications = await Admission.countDocuments({
        submittedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      
      stats = { ...formattedStats, recent: recentApplications };
    } else {
      // Use fallback storage
      console.log('Using fallback storage for stats - database not available');
      stats = fallbackStorage.getStats();
      
      // Calculate recent applications (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentCount = fallbackStorage.getAllAdmissions().filter(
        admission => new Date(admission.createdAt) >= thirtyDaysAgo
      ).length;
      
      stats.recent = recentCount;
    }
    
    sendSuccess(res, stats, 'Admission statistics retrieved successfully');
    
  } catch (error) {
    console.error('Get admission stats error:', error);
    sendError(res, 'Failed to get admission statistics', 500);
  }
});

// Validate admission data before submission (optional endpoint for client-side validation)
router.post('/validate', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return sendError(res, 'Email is required for validation', 400);
    }
    
    // Check if email already exists
    const existingApplication = await Admission.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingApplication) {
      return sendError(res, 'An application with this email already exists', 400);
    }
    
    sendSuccess(res, null, 'Email is available for admission');
    
  } catch (error) {
    console.error('Admission validation error:', error);
    sendError(res, 'Validation failed', 500);
  }
});

export default router;
