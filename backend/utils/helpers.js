import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Generate secure random password
export const generatePassword = (length = 12) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  const categories = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // uppercase
    'abcdefghijklmnopqrstuvwxyz', // lowercase
    '0123456789', // numbers
    '!@#$%^&*' // special characters
  ];
  
  // Add one character from each category
  categories.forEach(category => {
    password += category.charAt(Math.floor(Math.random() * category.length));
  });
  
  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate JWT token
export const generateJWTToken = (userId, role) => {
  return jwt.sign(
    { 
      userId,
      role,
      iat: Date.now() 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    }
  );
};

// Verify JWT token
export const verifyJWTToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Generate unique student ID with concurrency protection
export const generateStudentId = async (Admission) => {
  try {
    // Use a simple retry mechanism for concurrency protection
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Check both Admission and User collections for the highest student ID
      const [lastAdmission, lastUser] = await Promise.all([
        Admission
          .findOne({ student_id: { $exists: true, $ne: null } })
          .sort({ student_id: -1 })
          .select('student_id'),
        mongoose.model('User')
          .findOne({ student_id: { $exists: true, $ne: null } })
          .sort({ student_id: -1 })
          .select('student_id')
      ]);
      
      let nextNumber = 1;
      
      // Find the highest number from both collections
      const getNumberFromId = (id) => {
        if (!id || !id.student_id) return 0;
        return parseInt(id.student_id.replace('STU', '')) || 0;
      };
      
      const lastAdmissionNumber = getNumberFromId(lastAdmission);
      const lastUserNumber = getNumberFromId(lastUser);
      const highestNumber = Math.max(lastAdmissionNumber, lastUserNumber);
      
      if (highestNumber > 0) {
        nextNumber = highestNumber + 1;
      }
      
      const newStudentId = `STU${nextNumber.toString().padStart(4, '0')}`;
      
      // Check if this ID already exists (race condition check)
      const [existingAdmission, existingUser] = await Promise.all([
        Admission.findOne({ student_id: newStudentId }),
        mongoose.model('User').findOne({ student_id: newStudentId })
      ]);
      
      if (!existingAdmission && !existingUser) {
        console.log(`Generated new student ID: ${newStudentId} (previous highest: ${highestNumber}, attempt: ${attempts})`);
        return newStudentId;
      }
      
      console.log(`Student ID ${newStudentId} already exists, retrying... (attempt ${attempts})`);
      
      // Small delay before retry
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Failed to generate unique student ID after multiple attempts');
  } catch (error) {
    console.error('Error generating student ID:', error);
    throw new Error('Failed to generate student ID');
  }
};

// Format student data for ID card
export const formatStudentDataForIdCard = (student) => {
  return {
    studentId: student.student_id,
    name: student.name,
    email: student.email,
    mobile: student.mobile,
    bloodGroup: student.bloodGroup,
    standard: student.standard,
    photoUrl: student.photo?.url,
    issueDate: new Date().toLocaleDateString('en-IN'),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN') // Valid for 1 year
  };
};

// Response helper functions
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

// Pagination helper
export const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Search helper
export const buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  const searchConditions = fields.map(field => ({
    [field]: searchRegex
  }));
  
  return { $or: searchConditions };
};

// Date range helper
export const buildDateRangeQuery = (startDate, endDate, field = 'createdAt') => {
  const query = {};
  
  if (startDate || endDate) {
    query[field] = {};
    
    if (startDate) {
      query[field].$gte = new Date(startDate);
    }
    
    if (endDate) {
      query[field].$lte = new Date(endDate);
    }
  }
  
  return query;
};
