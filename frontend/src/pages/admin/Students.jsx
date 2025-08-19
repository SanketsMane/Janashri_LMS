import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import {
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Form state for adding/editing students
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    bloodGroup: '',
    standard: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: ''
  });

  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined
      };

      const response = await adminAPI.getStudents(params);
      const { students: studentsData, pagination: paginationData } = response.data || {};

      setStudents(studentsData || []);
      setPagination(prev => ({
        ...prev,
        total: paginationData?.totalItems || 0,
        totalPages: paginationData?.totalPages || 0,
        page: paginationData?.currentPage || 1
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (studentId) => {
    try {
      const response = await adminAPI.getStudent(studentId);
      setSelectedStudent(response.data.student);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleToggleStatus = async (studentId) => {
    try {
      await adminAPI.toggleStudentStatus(studentId);
      await fetchStudents(); // Refresh the list
      alert('Student status updated successfully!');
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Error updating student status. Please try again.');
    }
  };

  const handleSendCredentials = async (studentId) => {
    try {
      setLoading(true);
      const response = await adminAPI.sendStudentCredentials(studentId);
      alert('Login credentials sent successfully to the student\'s email!');
    } catch (error) {
      console.error('Error sending credentials:', error);
      alert(error.message || 'Error sending credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      await adminAPI.deleteStudent(studentId);
      await fetchStudents(); // Refresh the list
      alert('Student deleted successfully!');
      if (showModal) setShowModal(false); // Close modal if open
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const response = await adminAPI.addStudent(formData);
      alert(`Student added successfully! Temporary password: ${response.data.temporaryPassword}`);
      setShowAddModal(false);
      resetForm();
      await fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error adding student:', error);
      alert(error.response?.data?.message || 'Error adding student. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      await adminAPI.updateStudent(selectedStudent._id, formData);
      alert('Student information updated successfully!');
      setShowEditModal(false);
      resetForm();
      await fetchStudents(); // Refresh the list
      if (showModal) setShowModal(false); // Close detail modal
    } catch (error) {
      console.error('Error updating student:', error);
      alert(error.response?.data?.message || 'Error updating student. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      mobile: student.mobile || '',
      bloodGroup: student.bloodGroup || '',
      standard: student.standard || '',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      address: student.address || '',
      emergencyContact: student.emergencyContact || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      bloodGroup: '',
      standard: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Student Management
              </h1>
              <p className="text-neutral-600">
                Manage enrolled students and their academic records
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="form-input pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                className="btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Students', value: pagination.total, color: 'text-primary-600', icon: UserGroupIcon },
            { label: 'Active Students', value: students.filter(s => s.isActive).length, color: 'text-success', icon: CheckBadgeIcon },
            { label: 'Inactive Students', value: students.filter(s => !s.isActive).length, color: 'text-error', icon: XMarkIcon }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Students Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center">
              <UserGroupIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">No students found.</p>
              <p className="text-sm text-neutral-500">
                Students who have been approved from admission applications will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Student ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Course</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Enrolled</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              {student.profilePhoto ? (
                                <img
                                  src={student.profilePhoto}
                                  alt={student.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900">{student.name}</div>
                              <div className="text-sm text-neutral-600">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                            {student.studentId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                            <AcademicCapIcon className="w-3 h-3 mr-1" />
                            {student.standard}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900">
                          {student.mobile}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.isActive)}`}>
                            {student.isActive ? (
                              <CheckBadgeIcon className="w-3 h-3 mr-1" />
                            ) : (
                              <XMarkIcon className="w-3 h-3 mr-1" />
                            )}
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(student._id)}
                              className="btn-outline btn-sm"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => openEditModal(student)}
                              className="btn-outline btn-sm text-blue-600 border-blue-600 hover:bg-blue-50"
                              title="Edit Student"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleToggleStatus(student._id)}
                              className={`btn-sm ${student.isActive ? 'btn-error' : 'btn-primary'}`}
                              title={student.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {student.isActive ? (
                                <XMarkIcon className="w-4 h-4" />
                              ) : (
                                <CheckBadgeIcon className="w-4 h-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteStudent(student._id, student.name)}
                              className="btn-sm btn-error text-red-600 border-red-600 hover:bg-red-50"
                              title="Delete Student"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-neutral-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Add New Student</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleAddStudent} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Course *
                    </label>
                    <select
                      name="standard"
                      value={formData.standard}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Course</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                      <option value="Bachelor of Science">Bachelor of Science</option>
                      <option value="Bachelor of Arts">Bachelor of Arts</option>
                      <option value="Bachelor of Commerce">Bachelor of Commerce</option>
                      <option value="Master of Science">Master of Science</option>
                      <option value="Master of Arts">Master of Arts</option>
                      <option value="Master of Commerce">Master of Commerce</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleFormChange}
                      className="form-input"
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
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      rows="3"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleFormChange}
                      className="form-input"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn-primary"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      'Add Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Edit Student: {selectedStudent.name}</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleEditStudent} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Course *
                    </label>
                    <select
                      name="standard"
                      value={formData.standard}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Course</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                      <option value="Bachelor of Science">Bachelor of Science</option>
                      <option value="Bachelor of Arts">Bachelor of Arts</option>
                      <option value="Bachelor of Commerce">Bachelor of Commerce</option>
                      <option value="Master of Science">Master of Science</option>
                      <option value="Master of Arts">Master of Arts</option>
                      <option value="Master of Commerce">Master of Commerce</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleFormChange}
                      className="form-input"
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
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      rows="3"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleFormChange}
                      className="form-input"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn-primary"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for viewing student details */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Student Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    {selectedStudent.profilePhoto ? (
                      <img
                        src={selectedStudent.profilePhoto}
                        alt={selectedStudent.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-10 h-10 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{selectedStudent.name}</h3>
                    <p className="text-neutral-600 mb-1">Student ID: {selectedStudent.studentId}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.isActive)}`}>
                      {selectedStudent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Email</label>
                        <p className="text-neutral-900">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Mobile</label>
                        <p className="text-neutral-900">{selectedStudent.mobile}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Date of Birth</label>
                        <p className="text-neutral-900">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Address</label>
                        <p className="text-neutral-900">{selectedStudent.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Academic Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Course</label>
                        <p className="text-neutral-900">{selectedStudent.standard}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Enrollment Date</label>
                        <p className="text-neutral-900">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Last Login</label>
                        <p className="text-neutral-900">
                          {selectedStudent.lastLogin 
                            ? new Date(selectedStudent.lastLogin).toLocaleString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center space-x-4">
                  <button
                    onClick={() => handleSendCredentials(selectedStudent._id)}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    {loading ? 'Sending...' : 'Send Credentials'}
                  </button>
                  
                  <button
                    onClick={() => openEditModal(selectedStudent)}
                    className="btn btn-outline"
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit Student
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(selectedStudent._id)}
                    className={`btn ${selectedStudent.isActive ? 'btn-error' : 'btn-primary'}`}
                  >
                    {selectedStudent.isActive ? (
                      <>
                        <XMarkIcon className="w-5 h-5 mr-2" />
                        Deactivate Student
                      </>
                    ) : (
                      <>
                        <CheckBadgeIcon className="w-5 h-5 mr-2" />
                        Activate Student
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteStudent(selectedStudent._id, selectedStudent.name)}
                    className="btn btn-error"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
