import React, { useState, useEffect, useRef } from 'react';
import {
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminGallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalImages: 0,
    activeImages: 0,
    inactiveImages: 0,
    categoryStats: [],
    storageUsed: 0
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);
  const [draggedFiles, setDraggedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  const fileInputRef = useRef(null);

  const categories = ['Campus', 'Facilities', 'Sports', 'Events', 'Students', 'Faculty'];

  // Utility function to format file sizes
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // API functions
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gallery/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }

      const data = await response.json();
      setGalleryImages(data.data.images);
      setStats(data.data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImagesAPI = async (files, imageDetails) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      formData.append('imageDetails', JSON.stringify(imageDetails));

      const token = localStorage.getItem('token');
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }

      const data = await response.json();
      await fetchGalleryImages(); // Refresh the gallery
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateImageAPI = async (imageId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update image');
      }

      await fetchGalleryImages(); // Refresh the gallery
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteImageAPI = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      await fetchGalleryImages(); // Refresh the gallery
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const bulkDeleteImagesAPI = async (imageIds) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gallery/bulk', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageIds })
      });

      if (!response.ok) {
        throw new Error('Failed to delete images');
      }

      await fetchGalleryImages(); // Refresh the gallery
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Filter images based on search and category
  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img._id));
    }
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      category: 'Campus',
      description: ''
    }));
    setDraggedFiles(newFiles);
    setShowUploadModal(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleEdit = (image) => {
    setEditingImage({ ...image });
    setShowEditModal(true);
  };

  const handleDelete = (image) => {
    setDeletingImage(image);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedImages.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    try {
      if (deletingImage) {
        await deleteImageAPI(deletingImage._id);
      } else if (selectedImages.length > 0) {
        await bulkDeleteImagesAPI(selectedImages);
        setSelectedImages([]);
      }
      setShowDeleteModal(false);
      setDeletingImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveEdit = async () => {
    try {
      const updateData = {
        title: editingImage.title,
        description: editingImage.description,
        category: editingImage.category,
        isActive: editingImage.isActive
      };
      await updateImageAPI(editingImage._id, updateData);
      setShowEditModal(false);
      setEditingImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveUpload = async () => {
    try {
      const files = draggedFiles.map(fileData => fileData.file);
      const imageDetails = draggedFiles.map(fileData => ({
        title: fileData.title,
        category: fileData.category,
        description: fileData.description
      }));
      
      await uploadImagesAPI(files, imageDetails);
      setShowUploadModal(false);
      setDraggedFiles([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-neutral-900 flex items-center">
                    <PhotoIcon className="w-8 h-8 mr-3 text-primary-600" />
                    Gallery Management
                  </h1>
                  <p className="text-neutral-600 mt-2">
                    Upload, organize, and manage website gallery images
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Upload Images</span>
                  </button>
                  {selectedImages.length > 0 && (
                    <button
                  onClick={handleBulkDelete}
                  className="btn btn-danger flex items-center space-x-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete Selected ({selectedImages.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Images</p>
                <p className="text-2xl font-bold text-neutral-900">{galleryImages.length}</p>
              </div>
              <PhotoIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Images</p>
                <p className="text-2xl font-bold text-neutral-900">{galleryImages.filter(img => img.isActive).length}</p>
              </div>
              <EyeIcon className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Categories</p>
                <p className="text-2xl font-bold text-neutral-900">{categories.length}</p>
              </div>
              <FunnelIcon className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Storage Used</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatFileSize(stats.storageUsed)}
                </p>
              </div>
              <DocumentArrowUpIcon className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {/* Select All */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-600">Select All</span>
              </label>
              
              {/* View Mode Toggle */}
              <div className="flex bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="bg-white rounded-xl shadow-sm border-2 border-dashed border-neutral-300 hover:border-primary-400 transition-colors mb-8 p-8"
        >
          <div className="text-center">
            <CloudArrowUpIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">Drag and drop images here or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Gallery Grid/List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              Gallery Images ({filteredImages.length})
            </h2>
          </div>
          <div className="p-6">
            {filteredImages.length > 0 ? (
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
                "space-y-4"
              }>
                {filteredImages.map((image) => (
                  <div key={image._id} className={`group relative ${
                    viewMode === 'grid' ? 'bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow' :
                    'flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200'
                  }`}>
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="aspect-w-16 aspect-h-12 relative">
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                              <button
                                onClick={() => handleEdit(image)}
                                className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(image)}
                                className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-neutral-900 text-sm">{image.title}</h3>
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(image._id)}
                              onChange={() => handleImageSelect(image._id)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                            />
                          </div>
                          <p className="text-xs text-neutral-600 mb-2">{image.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {image.category}
                            </span>
                            <span className="text-xs text-neutral-500">{image.uploadDate}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image._id)}
                          onChange={() => handleImageSelect(image._id)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-900">{image.title}</h3>
                          <p className="text-sm text-neutral-600 truncate">{image.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {image.category}
                            </span>
                            <span className="text-xs text-neutral-500">{image.uploadDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(image)}
                            className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(image)}
                            className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <PhotoIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No images found</h3>
                <p className="text-neutral-600 mb-6">Upload your first images to get started</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary"
                >
                  Upload First Images
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">Upload Images</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {draggedFiles.length > 0 ? (
                  <div className="space-y-6">
                    {draggedFiles.map((fileData, index) => (
                      <div key={index} className="flex space-x-4 p-4 border border-neutral-200 rounded-lg">
                        <img
                          src={fileData.preview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            placeholder="Image title"
                            value={fileData.title}
                            onChange={(e) => {
                              const newFiles = [...draggedFiles];
                              newFiles[index].title = e.target.value;
                              setDraggedFiles(newFiles);
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                          <select
                            value={fileData.category}
                            onChange={(e) => {
                              const newFiles = [...draggedFiles];
                              newFiles[index].category = e.target.value;
                              setDraggedFiles(newFiles);
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                          <textarea
                            placeholder="Description (optional)"
                            value={fileData.description}
                            onChange={(e) => {
                              const newFiles = [...draggedFiles];
                              newFiles[index].description = e.target.value;
                              setDraggedFiles(newFiles);
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowUploadModal(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveUpload}
                        className="btn btn-primary"
                      >
                        Upload Images
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudArrowUpIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-2">Drag and drop images here or</p>
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      browse files
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">Edit Image</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex space-x-4 mb-6">
                  <img
                    src={editingImage.image}
                    alt={editingImage.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <input
                      type="text"
                      placeholder="Image title"
                      value={editingImage.title}
                      onChange={(e) => setEditingImage({...editingImage, title: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={editingImage.category}
                      onChange={(e) => setEditingImage({...editingImage, category: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Description"
                      value={editingImage.description}
                      onChange={(e) => setEditingImage({...editingImage, description: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Confirm Delete</h2>
                </div>
                <p className="text-neutral-600 mb-6">
                  {deletingImage 
                    ? `Are you sure you want to delete "${deletingImage.title}"?` 
                    : `Are you sure you want to delete ${selectedImages.length} selected images?`
                  } This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
