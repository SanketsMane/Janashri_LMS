import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  AcademicCapIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchAdmissions();
  }, [pagination.page, statusFilter, searchTerm]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      };

      const response = await adminAPI.getAdmissions(params);
      const { admissions: admissionsData, pagination: paginationData } = response.data;

      setAdmissions(admissionsData || []);
      setPagination(prev => ({
        ...prev,
        total: paginationData?.totalItems || 0,
        totalPages: paginationData?.totalPages || 0,
        page: paginationData?.currentPage || 1
      }));
    } catch (error) {
      console.error('Error fetching admissions:', error);
      setAdmissions([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAdmission = async (admissionId, status, remarks = '') => {
    try {
      const action = status === 'approved' ? 'accept' : 'reject';
      await adminAPI.processAdmission({
        admissionId,
        action,
        rejectionReason: remarks
      });
      
      // Refresh the list
      await fetchAdmissions();
      
      // Close modal if open
      setShowModal(false);
      setSelectedAdmission(null);
      
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error processing admission:', error);
      alert('Error processing admission. Please try again.');
    }
  };

  const handleViewDetails = async (admissionId) => {
    console.log('=== DEBUG: handleViewDetails called ===');
    console.log('Admission ID:', admissionId);
    
    try {
      console.log('Making API call to get admission details...');
      const response = await adminAPI.getAdmission(admissionId);
      console.log('=== API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response.data.admission:', response.data.admission);
      
      if (response.data && response.data.admission) {
        console.log('Setting selected admission...');
        setSelectedAdmission(response.data.admission);
        console.log('Showing modal...');
        setShowModal(true);
        console.log('Modal state should be true now');
      } else {
        console.error('=== INVALID RESPONSE STRUCTURE ===');
        console.error('Expected response.data.admission but got:', response.data);
        alert('Error: Invalid response from server');
      }
    } catch (error) {
      console.error('=== ERROR FETCHING ADMISSION DETAILS ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      alert(`Error fetching admission details: ${error.message}. Please check the console for more details.`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return CheckCircleIcon;
      case 'rejected':
        return XCircleIcon;
      case 'pending':
        return ClockIcon;
      default:
        return ClockIcon;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Admission Management
              </h1>
              <p className="text-neutral-600">
                Review and process student admission applications
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="form-input pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="form-select w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applications', value: pagination.total, color: 'text-primary-600' },
            { label: 'Pending', value: admissions.filter(a => a.status === 'pending').length, color: 'text-warning' },
            { label: 'Approved', value: admissions.filter(a => a.status === 'approved').length, color: 'text-success' },
            { label: 'Rejected', value: admissions.filter(a => a.status === 'rejected').length, color: 'text-error' }
          ].map((stat, index) => (
            <div key={index} className="card p-6">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading applications...</p>
            </div>
          ) : admissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-neutral-600">No applications found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Course</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {admissions.map((admission) => {
                      const StatusIcon = getStatusIcon(admission.status);
                      return (
                        <tr key={admission._id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-primary-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-neutral-900">{admission.name}</div>
                                <div className="text-sm text-neutral-600">{admission.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                              {admission.course}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-900">
                            {admission.mobile}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {new Date(admission.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(admission.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDetails(admission._id)}
                                className="btn-outline btn-sm"
                              >
                                <EyeIcon className="w-4 h-4" />
                                View
                              </button>
                              
                              {admission.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleProcessAdmission(admission._id, 'approved')}
                                    className="btn-primary btn-sm"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleProcessAdmission(admission._id, 'rejected')}
                                    className="btn-error btn-sm"
                                  >
                                    <XCircleIcon className="w-4 h-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} applications
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

        {/* Modal for viewing admission details */}
        {console.log('=== MODAL RENDER CHECK ===', { showModal, selectedAdmission: !!selectedAdmission })}
        {showModal && selectedAdmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Application Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {console.log('=== SELECTED ADMISSION DATA ===', selectedAdmission)}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Full Name</label>
                        <p className="text-neutral-900">{selectedAdmission.name || `${selectedAdmission.firstName} ${selectedAdmission.lastName}`}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Email</label>
                        <p className="text-neutral-900">{selectedAdmission.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Mobile</label>
                        <p className="text-neutral-900">{selectedAdmission.mobile || selectedAdmission.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Date of Birth</label>
                        <p className="text-neutral-900">{new Date(selectedAdmission.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Address</label>
                        <p className="text-neutral-900">{selectedAdmission.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Academic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Course</label>
                        <p className="text-neutral-900">{selectedAdmission.course}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Previous Education</label>
                        <p className="text-neutral-900">{selectedAdmission.previousEducation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAdmission.status)}`}>
                          {selectedAdmission.status.charAt(0).toUpperCase() + selectedAdmission.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">Submitted On</label>
                        <p className="text-neutral-900">{new Date(selectedAdmission.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {selectedAdmission.documents && selectedAdmission.documents.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Documents</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedAdmission.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                          <DocumentArrowDownIcon className="w-8 h-8 text-primary-600 mb-2" />
                          <p className="text-sm font-medium text-neutral-900 truncate">{doc.name}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedAdmission.status === 'pending' && (
                  <div className="mt-8 flex items-center space-x-4">
                    <button
                      onClick={() => handleProcessAdmission(selectedAdmission._id, 'approved')}
                      className="btn-primary"
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => handleProcessAdmission(selectedAdmission._id, 'rejected')}
                      className="btn-error"
                    >
                      <XCircleIcon className="w-5 h-5 mr-2" />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAdmissions;
