import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  student_id: {
    type: String,
    unique: true,
    sparse: true, // Only unique if not null
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  // Computed field for full name
  name: {
    type: String,
    // Will be computed from firstName + lastName
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  nationality: {
    type: String,
    default: 'Indian',
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  // Alias for backward compatibility
  mobile: {
    type: String,
    // Will be set same as phone
  },
  alternatePhone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit alternate phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
  },
  
  // Academic Information
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  // Alias for backward compatibility
  standard: {
    type: String,
    // Will be set same as course
  },
  previousSchool: {
    type: String,
    default: 'Not specified',
    trim: true
  },
  previousEducation: {
    type: String,
    // Computed from previousSchool and other academic info
  },
  previousPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  boardOfStudy: {
    type: String,
    default: 'Not specified',
    trim: true
  },
  yearOfPassing: {
    type: Number,
    default: new Date().getFullYear(),
    min: [1950, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Invalid year']
  },
  
  // Parent/Guardian Information
  fatherName: {
    type: String,
    default: 'Not specified',
    trim: true
  },
  fatherOccupation: {
    type: String,
    default: 'Not specified',
    trim: true
  },
  motherName: {
    type: String,
    default: 'Not specified',
    trim: true
  },
  motherOccupation: {
    type: String,
    default: 'Not specified',
    trim: true
  },
  guardianPhone: {
    type: String,
    default: function() { return this.phone; }, // Use main phone as default
    match: [/^\d{10}$/, 'Please enter a valid 10-digit guardian phone number']
  },
  
  // Additional Information
  extracurricular: {
    type: String,
    trim: true
  },
  medicalHistory: {
    type: String,
    trim: true
  },
  specialRequirements: {
    type: String,
    trim: true
  },
  
  // Documents
  documents: [{
    type: {
      type: String,
      required: true,
      enum: ['photo', 'marksheet', 'transferCertificate', 'birthCertificate']
    },
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    name: String
  }],
  
  // Legacy photo field for backward compatibility
  photo: {
    url: String,
    public_id: String
  },
  
  // Status and Processing
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  password: {
    type: String,
    // Only required when status is approved
  },
  remarks: {
    type: String,
    // Admin remarks/rejection reason
  },
  rejectionReason: {
    type: String,
    // Backward compatibility
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date,
    // Set when status changes from pending
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Reference to admin who processed the application
  }
}, {
  timestamps: true
});

// Pre-save middleware to compute derived fields
admissionSchema.pre('save', async function(next) {
  // Compute full name
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  
  // Set mobile for backward compatibility
  if (this.phone) {
    this.mobile = this.phone;
  }
  
  // Set standard for backward compatibility
  if (this.course) {
    this.standard = this.course;
  }
  
  // Set guardian phone default
  if (!this.guardianPhone && this.phone) {
    this.guardianPhone = this.phone;
  }
  
  // Compute previous education
  if (this.previousSchool && this.boardOfStudy) {
    this.previousEducation = `${this.previousSchool} (${this.boardOfStudy})`;
  } else if (this.previousSchool) {
    this.previousEducation = this.previousSchool;
  }
  
  // Set photo from documents for backward compatibility
  if (this.documents && this.documents.length > 0) {
    const photoDoc = this.documents.find(doc => doc.type === 'photo');
    if (photoDoc) {
      this.photo = {
        url: photoDoc.url,
        public_id: photoDoc.public_id
      };
    }
  }
  
  // Note: student_id is now generated explicitly in admin route
  // to avoid race conditions and ensure proper sequencing
  
  next();
});

// Index for better performance
admissionSchema.index({ email: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ student_id: 1 });
admissionSchema.index({ submittedAt: -1 });

export default mongoose.model('Admission', admissionSchema);
