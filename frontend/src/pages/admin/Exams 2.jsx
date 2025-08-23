import React, { useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AdminExams = () => {
  const [exams, setExams] = useState([
    // TODO: Replace with actual API data
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center">
                <DocumentTextIcon className="w-8 h-8 mr-3 text-primary-600" />
                Exam Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Schedule exams, manage questions, and oversee assessments
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create New Exam</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Exams</p>
                <p className="text-2xl font-bold text-neutral-900">{exams.length}</p>
              </div>
              <DocumentTextIcon className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Upcoming</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <CalendarDaysIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">In Progress</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <ClockIcon className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="flex border-b border-neutral-200">
            <button className="px-6 py-4 text-sm font-medium border-b-2 border-primary-600 text-primary-600">
              All Exams
            </button>
            <button className="px-6 py-4 text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Upcoming
            </button>
            <button className="px-6 py-4 text-sm font-medium text-neutral-600 hover:text-neutral-900">
              In Progress
            </button>
            <button className="px-6 py-4 text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Completed
            </button>
            <button className="px-6 py-4 text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Draft
            </button>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">All Exams</h2>
          </div>
          <div className="p-6">
            {exams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Exam Details</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Course</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Students</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam.id} className="border-b border-neutral-100">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-neutral-900">{exam.title}</p>
                            <p className="text-sm text-neutral-600">{exam.duration} minutes • {exam.questions} questions</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">{exam.course}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-neutral-900">{exam.date}</p>
                            <p className="text-sm text-neutral-600">{exam.time}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <UsersIcon className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-600">{exam.students || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exam.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            exam.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                            exam.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {exam.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No exams scheduled</h3>
                <p className="text-neutral-600 mb-6">Create your first exam to get started</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary"
                >
                  Create First Exam
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExams;
