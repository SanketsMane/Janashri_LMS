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
      await fetchStudents();
      alert('Student status updated successfully!');
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Error updating student status. Please try again.');
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      try {
        await adminAPI.deleteStudent(studentId);
        await fetchStudents();
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
      }
    }
  };

  const handleSendCredentials = async (studentId) => {
    try {
      setFormLoading(true);
      await adminAPI.sendStudentCredentials(studentId);
      alert('Credentials sent successfully!');
    } catch (error) {
      console.error('Error sending credentials:', error);
      alert('Error sending credentials. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || `${student.firstName} ${student.lastName}` || '',
      email: student.email || '',
      mobile: student.mobile || '',
      bloodGroup: student.bloodGroup || '',
      standard: student.standard || '',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      address: student.address || '',
      emergencyContact: student.emergencyContact?.name || ''
    });
    setShowModal(false);
    setShowEditModal(true);
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await adminAPI.updateStudent(selectedStudent._id, formData);
      await fetchStudents();
      setShowEditModal(false);
      resetForm();
      alert('Student updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await adminAPI.createStudent(formData);
      await fetchStudents();
      setShowAddModal(false);
      resetForm();
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student. Please try again.');
    } finally {
      setFormLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Student Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage enrolled students and their academic records
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Clean Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Students', 
              value: pagination.total, 
              icon: UserGroupIcon,
              color: 'blue'
            },
            { 
              label: 'Active Students', 
              value: students.filter(s => s.isActive).length, 
              icon: CheckBadgeIcon,
              color: 'green'
            },
            { 
              label: 'Inactive Students', 
              value: students.filter(s => !s.isActive).length, 
              icon: XMarkIcon,
              color: 'red'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className={`h-6 w-6 ${
                        stat.color === 'blue' ? 'text-blue-400' : 
                        stat.color === 'green' ? 'text-green-400' : 
                        'text-red-400'
                      }`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.label}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Professional Students Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Students who have been approved from admission applications will appear here.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add First Student
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                {student.profilePhoto ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={student.profilePhoto}
                                    alt={student.name}
                                  />
                                ) : (
                                  <UserIcon className="h-6 w-6 text-gray-500" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : student.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {student.student_id || student.studentId || 'Not Assigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{student.standard}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.mobile || 'Not provided'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(student._id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => openEditModal(student)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit Student"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleToggleStatus(student._id)}
                              className={`p-1 ${
                                student.isActive 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              title={student.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {student.isActive ? (
                                <XMarkIcon className="h-4 w-4" />
                              ) : (
                                <CheckBadgeIcon className="h-4 w-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteStudent(student._id, student.name)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete Student"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Simple Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                        <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {pagination.page} of {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

        {/* Professional Student Details Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">Student Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-6">
                {/* Student Header */}
                <div className="flex items-center space-x-4 pb-6 border-b">
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    {selectedStudent.profilePhoto ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={selectedStudent.profilePhoto}
                        alt={selectedStudent.name}
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedStudent.firstName && selectedStudent.lastName ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : selectedStudent.name || 'Unknown'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ID: {selectedStudent.student_id || selectedStudent.studentId || 'Not Assigned'}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedStudent.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedStudent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h5>
                    <div className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedStudent.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedStudent.mobile || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedStudent.dateOfBirth 
                            ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Not provided'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedStudent.bloodGroup || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedStudent.address || 'Not provided'}</dd>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h5>
                    <div className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Course</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedStudent.standard || 'Not assigned'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Enrollment Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedStudent.createdAt 
                            ? new Date(selectedStudent.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Unknown'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedStudent.lastLogin 
                            ? new Date(selectedStudent.lastLogin).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Never logged in'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedStudent.isActive ? 'Can log in and access system' : 'Account disabled'}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 pt-6 border-t">
                  <h5 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedStudent.emergencyContact?.name || 'Not provided'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedStudent.emergencyContact?.phone || 'Not provided'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedStudent.emergencyContact?.relationship || 'Not specified'}
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t flex flex-wrap gap-3">
                  <button
                    onClick={() => handleSendCredentials(selectedStudent._id)}
                    disabled={formLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {formLoading ? 'Sending...' : 'Send Credentials'}
                  </button>
                  
                  <button
                    onClick={() => openEditModal(selectedStudent)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Student
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(selectedStudent._id)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedStudent.isActive 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    }`}
                  >
                    {selectedStudent.isActive ? (
                      <>
                        <XMarkIcon className="w-4 h-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckBadgeIcon className="w-4 h-4 mr-2" />
                        Activate
                      </>
                    )}
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
