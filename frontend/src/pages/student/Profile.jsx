import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import { studentAPI } from '../../utils/api';
import {
  UserCircleIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  HomeIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    bloodGroup: '',
    standard: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        bloodGroup: user.bloodGroup || '',
        standard: user.standard || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || {
          name: '',
          relationship: '',
          phone: ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    
    if (field === 'emergencyContact') {
      setProfileData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [name]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.updateProfile(profileData);
      setUser(response.data.user);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        bloodGroup: user.bloodGroup || '',
        standard: user.standard || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || {
          name: '',
          relationship: '',
          phone: ''
        }
      });
    }
    setEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setLoading(true);
      const response = await studentAPI.uploadPhoto(formData);
      setUser(prev => ({ ...prev, photo: response.data.photo }));
      alert('Profile photo updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  return (
      return (
    <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <UserCircleIcon className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
              </div>
              <p className="text-neutral-600">Manage your personal information and academic details</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-primary"
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  {user?.photo?.url ? (
                    <img
                      src={user.photo.url}
                      alt={user?.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-primary-600" />
                  )}
                </div>
                
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <CameraIcon className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-neutral-900 mb-2">{user?.name}</h2>
              <p className="text-neutral-600 mb-1">Student ID: {user?.student_id}</p>
              <p className="text-neutral-600">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <UserIcon className="w-4 h-4 inline mr-1" />
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">{user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <p className="text-neutral-900 py-2">{user?.email}</p>
                    <p className="text-xs text-neutral-500">Email cannot be changed</p>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <PhoneIcon className="w-4 h-4 inline mr-1" />
                      Mobile Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="mobile"
                        value={profileData.mobile}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your mobile number"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">{user?.mobile || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <HeartIcon className="w-4 h-4 inline mr-1" />
                      Blood Group
                    </label>
                    {editing ? (
                      <select
                        name="bloodGroup"
                        value={profileData.bloodGroup}
                        onChange={handleInputChange}
                        className="input-field"
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
                    ) : (
                      <p className="text-neutral-900 py-2">{user?.bloodGroup || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Standard */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <AcademicCapIcon className="w-4 h-4 inline mr-1" />
                      Standard/Class
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="standard"
                        value={profileData.standard}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your standard/class"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">{user?.standard || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">
                        {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <HomeIcon className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="input-field"
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <p className="text-neutral-900 py-2">{user?.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-neutral-200 p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Contact Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.emergencyContact.name}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="input-field"
                        placeholder="Emergency contact name"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">
                        {user?.emergencyContact?.name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Relationship
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="relationship"
                        value={profileData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="input-field"
                        placeholder="Relationship (e.g., Parent, Guardian)"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">
                        {user?.emergencyContact?.relationship || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.emergencyContact.phone}
                        onChange={(e) => handleInputChange(e, 'emergencyContact')}
                        className="input-field"
                        placeholder="Emergency contact phone"
                      />
                    ) : (
                      <p className="text-neutral-900 py-2">
                        {user?.emergencyContact?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default StudentProfile;
