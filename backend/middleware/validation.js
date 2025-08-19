import { body, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  next();
};

// Admission form validation
export const validateAdmission = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('mobile')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
    
  body('bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please select a valid blood group'),
    
  body('standard')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Please provide a valid standard'),
    
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('studentId')
    .optional()
    .matches(/^STU\d{4}$/)
    .withMessage('Invalid student ID format'),
    
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  // Custom validation to ensure either studentId or email is provided
  body().custom((value, { req }) => {
    if (!req.body.studentId && !req.body.email) {
      throw new Error('Either student ID or email is required');
    }
    return true;
  }),
    
  handleValidationErrors
];

// Student profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('mobile')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
    
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please select a valid blood group'),
    
  body('standard')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Please provide a valid standard'),
    
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
    
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
    
  body('emergencyContact.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Emergency contact name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Emergency contact name can only contain letters and spaces'),
    
  body('emergencyContact.relationship')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Relationship must be between 2 and 50 characters'),
    
  body('emergencyContact.phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Emergency contact phone must be a valid 10-digit number'),
    
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  handleValidationErrors
];

// Contact form validation
export const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('mobile')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
    
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
    
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
    
  handleValidationErrors
];

// Admin approval validation
export const validateApproval = [
  body('admissionId')
    .isMongoId()
    .withMessage('Invalid admission ID'),
    
  body('action')
    .isIn(['accept', 'reject'])
    .withMessage('Action must be either accept or reject'),
    
  body('rejectionReason')
    .if(body('action').equals('reject'))
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
    
  handleValidationErrors
];
