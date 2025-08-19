import React, { useState } from 'react';
import { admissionAPI } from '../utils/api';
import {
  ClipboardDocumentIcon,
  PhotoIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: '',
    
    // Contact Information
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Academic Information
    course: '',
    previousSchool: '',
    previousPercentage: '',
    boardOfStudy: '',
    yearOfPassing: '',
    
    // Parent/Guardian Information
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    guardianPhone: '',
    
    // Additional Information
    extracurricular: '',
    medicalHistory: '',
    specialRequirements: ''
  });

  const [files, setFiles] = useState({
    photo: null,
    marksheet: null,
    transferCertificate: null,
    birthCertificate: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const steps = [
    { number: 1, title: 'Personal Details', icon: UserIcon },
    { number: 2, title: 'Academic Information', icon: AcademicCapIcon },
    { number: 3, title: 'Documents Upload', icon: DocumentArrowUpIcon },
    { number: 4, title: 'Review & Submit', icon: CheckCircleIcon }
  ];

  const courses = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Arts'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      nationality: '',
      email: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      course: '',
      previousSchool: '',
      previousPercentage: '',
      boardOfStudy: '',
      yearOfPassing: '',
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      guardianPhone: '',
      extracurricular: '',
      medicalHistory: '',
      specialRequirements: ''
    });
    setFiles({});
    console.log('Form reset - all data cleared');
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      const requiredFields = [
        'firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup',
        'email', 'phone', 'address', 'city', 'state', 'pincode', 'course'
      ];
      
      const missingFields = requiredFields.filter(field => 
        !formData[field] || formData[field].trim() === ''
      );
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      // Debug: Log the gender value being submitted
      console.log('Gender value being submitted:', formData.gender);
      console.log('All form data:', formData);
      
      // Prepare form data for submission
      const submissionData = new FormData();
      
      // Add form fields - ensure all required fields are included
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          submissionData.append(key, formData[key]);
        }
      });
      
      // Log what's being sent
      console.log('Form data being submitted:');
      for (let [key, value] of submissionData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // Add files
      Object.keys(files).forEach(fileType => {
        if (files[fileType]) {
          submissionData.append(fileType, files[fileType]);
        }
      });
      
      // Submit to API
      const response = await admissionAPI.submit(submissionData);
      
      console.log('Admission submitted successfully:', response.data);
      setSubmitStatus('success');
      
    } catch (error) {
      console.error('Error submitting admission:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card p-12">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                Thank you for applying to Janashiri Institute. We have received your application 
                and will review it within 2-3 business days.
              </p>
              <div className="space-y-4">
                <div className="alert-info">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="text-left">
                      <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• You will receive a confirmation email shortly</li>
                        <li>• Our admissions team will review your application</li>
                        <li>• We'll contact you within 2-3 business days</li>
                        <li>• Keep your application reference number safe</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="btn-primary"
                  >
                    Return to Home
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admission-status'}
                    className="btn-outline"
                  >
                    Check Application Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card p-12">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <ExclamationCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                Submission Failed
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                We encountered an error while processing your application. Please try again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setSubmitStatus(null)}
                  className="btn-primary"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn-outline"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="hero relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-600/90"></div>
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <ClipboardDocumentIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Admission Application
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Take the first step towards your bright future at Janashiri Institute. 
              Complete your admission application below.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center space-x-2 min-w-max">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-success text-white shadow-lg' :
                    isActive ? 'bg-primary-600 text-white shadow-lg' :
                    'bg-neutral-200 text-neutral-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${
                      isActive ? 'text-primary-600' : 
                      isCompleted ? 'text-success' : 
                      'text-neutral-600'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      isActive ? 'text-primary-600' : 
                      isCompleted ? 'text-success' : 
                      'text-neutral-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="card-body">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Personal Information</h2>
                    <p className="text-neutral-600">Please provide your basic personal details</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                        key="gender-select-fixed"
                        autoComplete="off"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {/* Fixed gender enum values to match backend */}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nationality *</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., Indian"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows={3}
                        placeholder="Enter your complete address"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="State"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pin Code *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="400001"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Information */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Academic Information</h2>
                    <p className="text-neutral-600">Tell us about your academic background</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Course Applied For *</label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Previous School/College *</label>
                      <input
                        type="text"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Name of your previous institution"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Percentage/CGPA *</label>
                      <input
                        type="text"
                        name="previousPercentage"
                        value={formData.previousPercentage}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., 85% or 8.5 CGPA"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Board of Study *</label>
                      <input
                        type="text"
                        name="boardOfStudy"
                        value={formData.boardOfStudy}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., CBSE, ICSE, State Board"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year of Passing *</label>
                      <input
                        type="number"
                        name="yearOfPassing"
                        value={formData.yearOfPassing}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="2024"
                        min="2015"
                        max="2025"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Parent/Guardian Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">Father's Name *</label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Father's full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Father's Occupation</label>
                        <input
                          type="text"
                          name="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Father's occupation"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mother's Name *</label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Mother's full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mother's Occupation</label>
                        <input
                          type="text"
                          name="motherOccupation"
                          value={formData.motherOccupation}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Mother's occupation"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Guardian Phone *</label>
                        <input
                          type="tel"
                          name="guardianPhone"
                          value={formData.guardianPhone}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Document Upload</h2>
                    <p className="text-neutral-600">Please upload the required documents</p>
                  </div>

                  <div className="alert-info">
                    <div className="flex items-start space-x-3">
                      <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Document Requirements</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Maximum file size: 5MB per document</li>
                          <li>• Accepted formats: PDF, JPG, PNG</li>
                          <li>• All documents should be clear and readable</li>
                          <li>• Scanned copies are acceptable</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { key: 'photo', label: 'Passport Size Photo *', icon: PhotoIcon, required: true },
                      { key: 'marksheet', label: 'Latest Marksheet *', icon: DocumentArrowUpIcon, required: true },
                      { key: 'transferCertificate', label: 'Transfer Certificate', icon: DocumentArrowUpIcon, required: false },
                      { key: 'birthCertificate', label: 'Birth Certificate', icon: DocumentArrowUpIcon, required: false }
                    ].map((doc) => {
                      const Icon = doc.icon;
                      const file = files[doc.key];
                      
                      return (
                        <div key={doc.key} className="form-group">
                          <label className="form-label">{doc.label}</label>
                          <div className="relative">
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e, doc.key)}
                              className="hidden"
                              id={doc.key}
                              accept=".pdf,.jpg,.jpeg,.png"
                              required={doc.required}
                            />
                            <label
                              htmlFor={doc.key}
                              className={`flex items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                                file ? 'border-success bg-green-50' : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50'
                              }`}
                            >
                              <div className="text-center">
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${file ? 'text-success' : 'text-neutral-400'}`} />
                                {file ? (
                                  <>
                                    <p className="text-sm font-semibold text-success mb-1">File Uploaded</p>
                                    <p className="text-xs text-neutral-600">{file.name}</p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm font-semibold text-neutral-700 mb-1">Click to upload</p>
                                    <p className="text-xs text-neutral-500">PDF, JPG, PNG (Max 5MB)</p>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Review & Submit</h2>
                    <p className="text-neutral-600">Please review your information before submitting</p>
                  </div>

                  <div className="space-y-6">
                    <div className="card bg-neutral-50">
                      <div className="card-header">
                        <h3 className="text-lg font-bold text-neutral-900">Personal Information</h3>
                      </div>
                      <div className="card-body">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
                          <div><span className="font-medium">Email:</span> {formData.email}</div>
                          <div><span className="font-medium">Phone:</span> {formData.phone}</div>
                          <div><span className="font-medium">Course:</span> {formData.course}</div>
                        </div>
                      </div>
                    </div>

                    <div className="alert-warning">
                      <div className="flex items-start space-x-3">
                        <ExclamationCircleIcon className="w-6 h-6 text-yellow-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                          <p className="text-sm text-yellow-700">
                            By submitting this application, you confirm that all information provided is accurate 
                            and complete. Any false information may result in application rejection.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn-secondary text-sm px-6 py-2 mr-4"
                      >
                        Reset Form
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`btn-primary text-lg px-12 py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="loading mr-3"></div>
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="w-6 h-6 mr-3" />
                            Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between pt-8 border-t border-neutral-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`btn ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'btn-outline'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                  >
                    Next Step
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
