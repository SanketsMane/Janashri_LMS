import React, { useState } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample gallery data (replace with API data)
  const galleryImages = [
    {
      id: 1,
      title: 'Campus Building',
      category: 'Campus',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      description: 'Main academic building with modern facilities'
    },
    {
      id: 2,
      title: 'Science Laboratory',
      category: 'Facilities',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
      description: 'State-of-the-art science laboratory'
    },
    {
      id: 3,
      title: 'Library',
      category: 'Facilities',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      description: 'Comprehensive library with digital resources'
    },
    {
      id: 4,
      title: 'Computer Lab',
      category: 'Facilities',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      description: 'Modern computer laboratory'
    },
    {
      id: 5,
      title: 'Sports Ground',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop',
      description: 'Multi-purpose sports ground'
    },
    {
      id: 6,
      title: 'Student Activities',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
      description: 'Annual cultural festival celebration'
    },
    {
      id: 7,
      title: 'Classroom',
      category: 'Campus',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
      description: 'Smart classroom with interactive boards'
    },
    {
      id: 8,
      title: 'Graduation Ceremony',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=600&fit=crop',
      description: 'Annual graduation ceremony'
    }
  ];

  const categories = ['All', ...new Set(galleryImages.map(img => img.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="hero relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-600/90"></div>
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <PhotoIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Campus Gallery
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Explore our beautiful campus, modern facilities, and vibrant student life 
              through our comprehensive photo gallery
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        {/* Category Filter */}
        <div className="text-center mb-12">
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-soft">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-soft'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item group cursor-pointer animate-fade-in"
              onClick={() => openLightbox(image, index)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-200">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="gallery-overlay">
                  <div className="text-center text-white">
                    <EyeIcon className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <PhotoIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No images found in this category</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{galleryImages.length}+</div>
            <div className="text-neutral-600">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{categories.length - 1}</div>
            <div className="text-neutral-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
            <div className="text-neutral-600">Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-neutral-600">Facilities</div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
              <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-white/80 text-sm mb-2">{selectedImage.description}</p>
              <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
