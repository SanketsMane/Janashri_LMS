import express from 'express';
import User from '../models/User.js';
import Admission from '../models/Admission.js';
import { authenticate, adminOnly, adminOrSelf } from '../middleware/auth.js';
import { validateApproval } from '../middleware/validation.js';
import { sendSuccess, sendError, generatePassword, getPaginationParams, buildSearchQuery, generateStudentId } from '../utils/helpers.js';
import { sendAcceptanceEmail, sendRejectionEmail } from '../utils/email.js';
import { deleteCloudinaryImage } from '../middleware/upload.js';

const router = express.Router();

// Get all admission applications (with filtering and pagination)
router.get('/admissions', authenticate, adminOnly, async (req, res) => {
  try {
    const { status, search, startDate, endDate } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);
    
    // Build query
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      const searchQuery = buildSearchQuery(search, ['name', 'email', 'mobile', 'student_id']);
      query = { ...query, ...searchQuery };
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }
    
    // Get total count for pagination
    const total = await Admission.countDocuments(query);
    
    // Get admissions with pagination
    const admissions = await Admission.find(query)
      .populate('processedBy', 'email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    sendSuccess(res, {
      admissions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, 'Admissions retrieved successfully');
    
  } catch (error) {
    console.error('Get admissions error:', error);
    sendError(res, 'Failed to get admissions', 500);
  }
});

// Get single admission application
router.get('/admissions/:id', authenticate, adminOnly, async (req, res) => {
  try {
    console.log('Getting admission for ID:', req.params.id);
    const admission = await Admission.findById(req.params.id)
      .populate('processedBy', 'email');
    
    console.log('Found admission:', admission ? 'YES' : 'NO');
    
    if (!admission) {
      console.log('Admission not found for ID:', req.params.id);
      return sendError(res, 'Admission application not found', 404);
    }
    
    console.log('Sending admission data:', { admission: admission._id });
    sendSuccess(res, { admission }, 'Admission application retrieved successfully');
    
  } catch (error) {
    console.error('Get admission error:', error);
    sendError(res, 'Failed to get admission application', 500);
  }
});

// Process admission application (Accept/Reject)
router.post('/admissions/process', authenticate, adminOnly, validateApproval, async (req, res) => {
  try {
    const { admissionId, action, rejectionReason } = req.body;
    
    const admission = await Admission.findById(admissionId);
    if (!admission) {
      return sendError(res, 'Admission application not found', 404);
    }
    
    if (admission.status !== 'pending') {
      return sendError(res, 'This application has already been processed', 400);
    }
    
    if (action === 'accept') {
      // Generate random password
      const password = generatePassword(10);
      
      // Generate unique student ID
      const studentId = await generateStudentId(Admission);
      
      // Create user account
      const user = new User({
        email: admission.email,
        password: password,
        role: 'student',
        student_id: studentId,
        name: admission.name,
        mobile: admission.mobile,
        bloodGroup: admission.bloodGroup,
        standard: admission.standard,
        photo: admission.photo,
        isActive: true
      });
      
      await user.save();
      
      // Update admission record with student ID
      admission.status = 'approved';
      admission.student_id = studentId;
      admission.password = password; // Store temporarily for email
      admission.processedAt = new Date();
      admission.processedBy = req.user._id;
      await admission.save();
      
      // Send acceptance email
      try {
        await sendAcceptanceEmail({
          name: admission.name,
          email: admission.email,
          student_id: studentId,
          password: password
        });
      } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError);
        // Don't fail the entire operation if email fails
      }
      
      sendSuccess(res, {
        student_id: studentId,
        status: admission.status
      }, 'Application accepted successfully');
      
    } else if (action === 'reject') {
      // Update admission record
      admission.status = 'rejected';
      admission.rejectionReason = rejectionReason;
      admission.processedAt = new Date();
      admission.processedBy = req.user._id;
      await admission.save();
      
      // Send rejection email
      try {
        await sendRejectionEmail({
          name: admission.name,
          email: admission.email
        }, rejectionReason);
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }
      
      // Delete uploaded photo from Cloudinary
      try {
        if (admission.photo && admission.photo.public_id) {
          await deleteCloudinaryImage(admission.photo.public_id);
        }
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
      }
      
      sendSuccess(res, {
        status: admission.status
      }, 'Application rejected successfully');
    }
    
  } catch (error) {
    console.error('Process admission error:', error);
    sendError(res, 'Failed to process admission application', 500);
  }
});

// Get all students
router.get('/students', authenticate, adminOnly, async (req, res) => {
  try {
    const { search, standard, isActive } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);
    
    // Build query
    let query = { role: 'student' };
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Filter by standard
    if (standard && standard !== 'all') {
      query.standard = standard;
    }
    
    // Search functionality
    if (search) {
      const searchQuery = buildSearchQuery(search, ['name', 'email', 'mobile', 'student_id']);
      query = { ...query, ...searchQuery };
    }
    
    // Get total count
    const total = await User.countDocuments(query);
    
    // Get students
    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    sendSuccess(res, {
      students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    }, 'Students retrieved successfully');
    
  } catch (error) {
    console.error('Get students error:', error);
    sendError(res, 'Failed to get students', 500);
  }
});

// Get single student
router.get('/students/:studentId', authenticate, adminOnly, async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.studentId,
      role: 'student' 
    }).select('-password');
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    sendSuccess(res, { student }, 'Student retrieved successfully');
    
  } catch (error) {
    console.error('Get student error:', error);
    sendError(res, 'Failed to get student', 500);
  }
});

// Send login credentials to student
router.post('/students/:studentId/send-credentials', authenticate, adminOnly, async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.studentId,
      role: 'student' 
    });
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    // Generate student ID if not present
    let studentId = student.student_id;
    if (!studentId) {
      studentId = await generateStudentId(Admission);
      student.student_id = studentId;
    }

    // Generate a new password (always send a fresh password for security)
    const newPassword = generatePassword(10);
    student.password = newPassword;
    await student.save();

    // Import the send credentials email function
    const { sendStudentCredentialsEmail } = await import('../utils/email.js');
    
    // Send credentials email
    await sendStudentCredentialsEmail(
      student.email,
      student.name,
      studentId,
      newPassword
    );
    
    sendSuccess(res, {
      studentId: student._id,
      email: student.email,
      student_id: studentId
    }, 'Login credentials sent successfully to student');
    
  } catch (error) {
    console.error('Send credentials error:', error);
    sendError(res, 'Failed to send credentials', 500);
  }
});

// Toggle student active status
router.patch('/students/:studentId/toggle-status', authenticate, adminOnly, async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.studentId,
      role: 'student' 
    });
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }
    
    student.isActive = !student.isActive;
    await student.save();
    
    sendSuccess(res, {
      studentId: student._id,
      isActive: student.isActive
    }, `Student ${student.isActive ? 'activated' : 'deactivated'} successfully`);
    
  } catch (error) {
    console.error('Toggle student status error:', error);
    sendError(res, 'Failed to toggle student status', 500);
  }
});

// Update student information
router.put('/students/:studentId', authenticate, adminOnly, async (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      name,
      email,
      mobile,
      bloodGroup,
      standard,
      dateOfBirth,
      address,
      emergencyContact
    } = req.body;

    const student = await User.findOne({ _id: studentId, role: 'student' });
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== student.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: studentId } });
      if (existingUser) {
        return sendError(res, 'Email is already in use', 400);
      }
    }

    // Update student information
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (mobile) updateData.mobile = mobile.trim();
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (standard) updateData.standard = standard;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (address) updateData.address = address.trim();
    if (emergencyContact) updateData.emergencyContact = emergencyContact.trim();

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    sendSuccess(res, { student: updatedStudent }, 'Student information updated successfully');

  } catch (error) {
    console.error('Update student error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendError(res, messages.join(', '), 400);
    }
    sendError(res, 'Failed to update student information', 500);
  }
});

// Delete student
router.delete('/students/:studentId', authenticate, adminOnly, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findOne({ _id: studentId, role: 'student' });
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    // Delete student's profile photo from Cloudinary if exists
    if (student.photo && student.photo.public_id) {
      try {
        await deleteCloudinaryImage(student.photo.public_id);
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
      }
    }

    // Delete the student record
    await User.findByIdAndDelete(studentId);
    
    sendSuccess(res, null, 'Student deleted successfully');

  } catch (error) {
    console.error('Delete student error:', error);
    sendError(res, 'Failed to delete student', 500);
  }
});

// Add new student manually
router.post('/students', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      bloodGroup,
      standard,
      dateOfBirth,
      address,
      emergencyContact
    } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !standard) {
      return sendError(res, 'Name, email, mobile, and course are required', 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return sendError(res, 'Email is already in use', 400);
    }

    // Generate student ID and password
    const studentId = await generateStudentId();
    const password = generatePassword();

    // Create new student
    const newStudent = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by the pre-save middleware
      mobile: mobile.trim(),
      bloodGroup,
      standard,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address: address ? address.trim() : null,
      emergencyContact: emergencyContact ? emergencyContact.trim() : null,
      role: 'student',
      student_id: studentId,
      isActive: true
    });

    await newStudent.save();

    // Remove password from response
    const studentResponse = newStudent.toObject();
    delete studentResponse.password;

    // TODO: Send welcome email with credentials
    // await sendWelcomeEmail(newStudent.email, { studentId, password });

    sendSuccess(res, { 
      student: studentResponse,
      temporaryPassword: password 
    }, 'Student added successfully');

  } catch (error) {
    console.error('Add student error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendError(res, messages.join(', '), 400);
    }
    sendError(res, 'Failed to add student', 500);
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', authenticate, adminOnly, async (req, res) => {
  try {
    // Admission statistics
    const admissionStats = await Admission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Student statistics
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    
    // Recent activity (last 30 days)
    const recentAdmissions = await Admission.countDocuments({
      submittedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const recentLogins = await User.countDocuments({
      role: 'student',
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    // Format admission stats
    const formattedAdmissionStats = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      total: 0
    };
    
    admissionStats.forEach(stat => {
      const status = stat._id.toLowerCase();
      formattedAdmissionStats[status] = stat.count;
      formattedAdmissionStats.total += stat.count;
    });
    
    sendSuccess(res, {
      admissions: formattedAdmissionStats,
      students: {
        total: totalStudents,
        active: activeStudents,
        inactive: totalStudents - activeStudents
      },
      activity: {
        recentAdmissions,
        recentLogins
      }
    }, 'Dashboard statistics retrieved successfully');
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    sendError(res, 'Failed to get dashboard statistics', 500);
  }
});

// Delete admission application (soft delete - mark as rejected)
router.delete('/admissions/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) {
      return sendError(res, 'Admission application not found', 404);
    }
    
    // If the application was accepted, we need to also delete the user account
    if (admission.status === 'Accepted') {
      await User.findOneAndDelete({ email: admission.email, role: 'student' });
    }
    
    // Delete uploaded photo from Cloudinary
    if (admission.photo && admission.photo.public_id) {
      try {
        await deleteCloudinaryImage(admission.photo.public_id);
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
      }
    }
    
    // Delete the admission record
    await Admission.findByIdAndDelete(req.params.id);
    
    sendSuccess(res, null, 'Admission application deleted successfully');
    
  } catch (error) {
    console.error('Delete admission error:', error);
    sendError(res, 'Failed to delete admission application', 500);
  }
});

export default router;
