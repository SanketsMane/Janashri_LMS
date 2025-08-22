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
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Modern Header with Glass Effect */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Student Management
                </h1>
                <p className="text-neutral-600">
                  Manage enrolled students and their academic records
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="form-input pl-10 w-64 bg-white/80 backdrop-blur-sm border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary group"
              >
                <PlusIcon className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Modern Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Students', 
              value: pagination.total, 
              icon: UserGroupIcon,
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              change: '+12%',
              changeType: 'positive'
            },
            { 
              label: 'Active Students', 
              value: students.filter(s => s.isActive).length, 
              icon: CheckBadgeIcon,
              color: 'from-emerald-500 to-emerald-600',
              bgColor: 'bg-emerald-50',
              change: '+8%',
              changeType: 'positive'
            },
            { 
              label: 'Inactive Students', 
              value: students.filter(s => !s.isActive).length, 
              icon: XMarkIcon,
              color: 'from-red-500 to-red-600',
              bgColor: 'bg-red-50',
              change: '-3%',
              changeType: 'negative'
            },
            { 
              label: 'New This Month', 
              value: students.filter(s => {
                const createdDate = new Date(s.createdAt);
                const currentDate = new Date();
                return createdDate.getMonth() === currentDate.getMonth() && 
                       createdDate.getFullYear() === currentDate.getFullYear();
              }).length, 
              icon: AcademicCapIcon,
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-50',
              change: '+24%',
              changeType: 'positive'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`card p-6 ${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 
                    'text-neutral-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Students Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6"></div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Loading students...</h3>
              <p className="text-neutral-600">Please wait while we fetch the student data.</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mb-6">
                <UserGroupIcon className="h-12 w-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">No students found</h3>
              <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
                Students who have been approved from admission applications will appear here. Get started by adding your first student.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add First Student
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Course & Level
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {students.map((student, index) => (
                      <tr key={student._id} className="hover:bg-gradient-to-r hover:from-primary-25 hover:to-secondary-25 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-md">
                                {student.profilePhoto ? (
                                  <img
                                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                                    src={student.profilePhoto}
                                    alt={student.name}
                                  />
                                ) : (
                                  <UserIcon className="h-7 w-7 text-primary-600" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-neutral-900">
                                {student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : student.name || 'Unknown Student'}
                              </div>
                              <div className="text-sm text-neutral-600 flex items-center">
                                <EnvelopeIcon className="h-3 w-3 mr-1" />
                                {student.email || 'No email provided'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 shadow-sm">
                            {student.student_id || student.studentId || `STD${String(index + 1).padStart(3, '0')}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-1 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-md mr-3">
                              <AcademicCapIcon className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-neutral-900">{student.standard || 'Not specified'}</div>
                              <div className="text-xs text-neutral-500">Academic Level</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 font-medium">{student.mobile || 'Not provided'}</div>
                          <div className="text-xs text-neutral-500">Primary Contact</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'Unknown'}
                          </div>
                          <div className="text-xs text-neutral-500">Enrollment</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            student.isActive 
                              ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800' 
                              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              student.isActive ? 'bg-emerald-500' : 'bg-red-500'
                            }`}></div>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetails(student._id)}
                              className="btn-outline btn-sm group"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4 group-hover:text-primary-600 transition-colors" />
                            </button>
                            <button
                              onClick={() => openEditModal(student)}
                              className="btn-secondary btn-sm group"
                              title="Edit Student"
                            >
                              <PencilIcon className="w-4 h-4 group-hover:text-secondary-600 transition-colors" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student._id, student.name || `${student.firstName} ${student.lastName}`)}
                              className="btn-error btn-sm group"
                              title="Delete Student"
                            >
                              <TrashIcon className="w-4 h-4 group-hover:text-red-600 transition-colors" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-700">
                        Showing <span className="font-semibold text-neutral-900">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-semibold text-neutral-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                        <span className="font-semibold text-neutral-900">{pagination.total}</span> students
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                          const page = pagination.page <= 3 ? index + 1 : 
                                      pagination.page + index - 2;
                          return page <= pagination.totalPages ? (
                            <button
                              key={page}
                              onClick={() => setPagination(prev => ({ ...prev, page }))}
                              className={`w-8 h-8 text-sm font-medium rounded-md transition-colors ${
                                pagination.page === page
                                  ? 'bg-primary-600 text-white shadow-md'
                                  : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                              }`}
                            >
                              {page}
                            </button>
                          ) : null;
                        })}
                      </div>
                      
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

        {/* Enhanced Student Details Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                  <h3 className="text-2xl font-bold text-neutral-900">Student Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-full p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Student Profile Header */}
                <div className="flex items-center space-x-6 py-6 border-b border-neutral-100">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-lg">
                    {selectedStudent.profilePhoto ? (
                      <img
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                        src={selectedStudent.profilePhoto}
                        alt={selectedStudent.name}
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-neutral-900 mb-1">
                      {selectedStudent.firstName && selectedStudent.lastName ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : selectedStudent.name || 'Unknown Student'}
                    </h4>
                    <p className="text-neutral-600 mb-3">
                      Student ID: <span className="font-semibold text-primary-600">{selectedStudent.student_id || selectedStudent.studentId || 'Not Assigned'}</span>
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                        selectedStudent.isActive 
                          ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800' 
                          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedStudent.isActive ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></div>
                        {selectedStudent.isActive ? 'Active Student' : 'Inactive Student'}
                      </span>
                      <button
                        onClick={() => handleSendCredentials(selectedStudent._id)}
                        disabled={formLoading}
                        className="btn-secondary btn-sm"
                      >
                        <EnvelopeIcon className="w-4 h-4 mr-1" />
                        Send Credentials
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Information Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information Card */}
                  <div className="bg-gradient-to-br from-blue-25 to-blue-50 rounded-xl p-6 border border-blue-100">
                    <h5 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      Personal Information
                    </h5>
                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Email Address</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">{selectedStudent.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Mobile Number</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">{selectedStudent.mobile || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Date of Birth</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">
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
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Blood Group</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">{selectedStudent.bloodGroup || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Address</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">{selectedStudent.address || 'Not provided'}</dd>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information Card */}
                  <div className="bg-gradient-to-br from-emerald-25 to-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <h5 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mr-3">
                        <AcademicCapIcon className="h-5 w-5 text-white" />
                      </div>
                      Academic Information
                    </h5>
                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Current Standard/Course</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">{selectedStudent.standard || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Enrollment Date</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">
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
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Emergency Contact</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">
                          {selectedStudent.emergencyContact?.name || selectedStudent.emergencyContact || 'Not provided'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Last Login</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">
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
                        <dt className="text-sm font-medium text-neutral-600 mb-1">Account Status</dt>
                        <dd className="text-sm text-neutral-900 font-medium bg-white px-3 py-2 rounded-lg border">
                          {selectedStudent.isActive ? 'Can log in and access system' : 'Account disabled'}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-neutral-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => openEditModal(selectedStudent)}
                    className="btn-primary"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add/Edit Student Modals can be implemented here */}
        {/* Note: Add modal and Edit modal components can be implemented similarly with enhanced styling */}
        
      </div>
    </div>
  );
};

export default AdminStudents;
