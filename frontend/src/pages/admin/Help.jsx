import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminHelp = () => {
  const [tickets, setTickets] = useState([
    // TODO: Replace with actual API data
  ]);

  const [faqs, setFaqs] = useState([
    // TODO: Replace with actual FAQ data
  ]);

  const [activeTab, setActiveTab] = useState('tickets');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center">
                <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-primary-600" />
                Help & Support Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage help documentation, support tickets, and student assistance
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{activeTab === 'tickets' ? 'New Ticket' : 'Add FAQ'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Tickets</p>
                <p className="text-2xl font-bold text-neutral-900">{tickets.length}</p>
              </div>
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Open Tickets</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <ExclamationTriangleIcon className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">In Progress</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <ClockIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Resolved</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="flex border-b border-neutral-200">
            <button 
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'tickets' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Support Tickets
            </button>
            <button 
              onClick={() => setActiveTab('faqs')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'faqs' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              FAQs & Documentation
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'analytics' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">Support Tickets</h2>
            </div>
            <div className="p-6">
              {tickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Ticket #</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Subject</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Priority</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Created</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b border-neutral-100">
                          <td className="py-4 px-4 font-mono text-sm">#{ticket.id}</td>
                          <td className="py-4 px-4">{ticket.student_name}</td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-neutral-900">{ticket.subject}</p>
                            <p className="text-sm text-neutral-600 truncate max-w-xs">{ticket.description}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.status === 'open' ? 'bg-orange-100 text-orange-700' :
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-neutral-600">{ticket.created_at}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
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
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No support tickets</h3>
                  <p className="text-neutral-600 mb-6">All students are happy! No support requests at the moment.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">FAQs & Documentation</h2>
            </div>
            <div className="p-6">
              {faqs.length > 0 ? (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900 mb-2">{faq.question}</h3>
                          <p className="text-neutral-600 text-sm">{faq.answer}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-neutral-500">
                            <span>Category: {faq.category}</span>
                            <span>Views: {faq.views || 0}</span>
                            <span>Updated: {faq.updated_at}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No FAQs created</h3>
                  <p className="text-neutral-600 mb-6">Start building your help documentation</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                  >
                    Create First FAQ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">Help & Support Analytics</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <QuestionMarkCircleIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-neutral-600">Detailed analytics and reporting for support tickets and help documentation</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHelp;
