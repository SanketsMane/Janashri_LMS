import React, { useState } from 'react';
import {
  BuildingLibraryIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const AdminLibrary = () => {
  const [books, setBooks] = useState([
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
                <BuildingLibraryIcon className="w-8 h-8 mr-3 text-primary-600" />
                Library Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage books, resources, and digital library content
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Books</p>
                <p className="text-2xl font-bold text-neutral-900">{books.length}</p>
              </div>
              <BuildingLibraryIcon className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Available</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <BookmarkIcon className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Borrowed</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <CalendarDaysIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Overdue</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
              <CalendarDaysIcon className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option>All Categories</option>
              <option>Programming</option>
              <option>Science</option>
              <option>Literature</option>
              <option>History</option>
            </select>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option>All Status</option>
              <option>Available</option>
              <option>Borrowed</option>
              <option>Reserved</option>
            </select>
          </div>
        </div>

        {/* Books Grid/Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Library Collection</h2>
          </div>
          <div className="p-6">
            {books.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Book Details</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-b border-neutral-100">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-16 bg-neutral-200 rounded flex items-center justify-center">
                              <BuildingLibraryIcon className="w-6 h-6 text-neutral-400" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{book.title}</p>
                              <p className="text-sm text-neutral-600">ISBN: {book.isbn}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">{book.author}</td>
                        <td className="py-4 px-4 text-neutral-600">{book.category}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            book.status === 'available' ? 'bg-green-100 text-green-700' :
                            book.status === 'borrowed' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {book.status}
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
                <BuildingLibraryIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No books in library</h3>
                <p className="text-neutral-600 mb-6">Start building your digital library</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary"
                >
                  Add First Book
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLibrary;
