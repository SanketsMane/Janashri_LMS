import express from 'express';
import Contact from '../models/Contact.js';
import { validateContact } from '../middleware/validation.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { sendSuccess, sendError, sanitizeInput, getPaginationParams, buildSearchQuery } from '../utils/helpers.js';
import { sendContactResponseEmail } from '../utils/email.js';

const router = express.Router();

// Submit contact form
router.post('/contact', validateContact, async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    };
    
    // Create contact message
    const contact = new Contact(sanitizedData);
    await contact.save();
    
    sendSuccess(res, {
      contactId: contact._id,
      submittedAt: contact.createdAt
    }, 'Contact message submitted successfully', 201);
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    sendError(res, 'Failed to submit contact message', 500);
  }
});

// Get institute information (public)
router.get('/institute-info', async (req, res) => {
  try {
    const instituteInfo = {
      name: 'Janashiri Institute',
      tagline: 'Excellence in Education',
      description: 'Janashiri Institute is a premier educational institution committed to providing quality education and nurturing future leaders. We offer comprehensive programs designed to develop both academic excellence and character building.',
      established: '2010',
      contact: {
        phone: '+91 9876543210',
        email: 'info@janashiri.edu',
        address: {
          line1: '123 Education Street',
          line2: 'Knowledge City',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        }
      },
      facilities: [
        'Modern Classrooms',
        'Computer Laboratory',
        'Library',
        'Sports Complex',
        'Cafeteria',
        'Transportation',
        'Medical Facility',
        'Playground'
      ],
      programs: [
        'Primary Education (1st - 5th)',
        'Secondary Education (6th - 10th)',
        'Higher Secondary (11th - 12th)',
        'Professional Courses'
      ],
      achievements: [
        '100% Pass Rate in Board Exams',
        'State Level Sports Championships',
        'Excellence in Academics',
        'Community Service Awards'
      ]
    };
    
    sendSuccess(res, instituteInfo, 'Institute information retrieved successfully');
    
  } catch (error) {
    console.error('Get institute info error:', error);
    sendError(res, 'Failed to get institute information', 500);
  }
});

// Get gallery images (public)
router.get('/gallery', async (req, res) => {
  try {
    // In a real application, you would fetch these from a database
    const galleryImages = [
      {
        id: 1,
        title: 'Campus Overview',
        description: 'Main campus building with modern facilities',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
        category: 'campus'
      },
      {
        id: 2,
        title: 'Computer Laboratory',
        description: 'State-of-the-art computer lab with latest equipment',
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
        category: 'facilities'
      },
      {
        id: 3,
        title: 'Library',
        description: 'Well-stocked library with thousands of books',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
        category: 'facilities'
      },
      {
        id: 4,
        title: 'Sports Day',
        description: 'Annual sports day celebration',
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
        category: 'events'
      },
      {
        id: 5,
        title: 'Science Exhibition',
        description: 'Students showcasing their science projects',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
        category: 'events'
      },
      {
        id: 6,
        title: 'Classroom',
        description: 'Modern classroom with smart board technology',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
        category: 'facilities'
      }
    ];
    
    const { category } = req.query;
    let filteredImages = galleryImages;
    
    if (category && category !== 'all') {
      filteredImages = galleryImages.filter(img => img.category === category);
    }
    
    sendSuccess(res, {
      images: filteredImages,
      categories: ['all', 'campus', 'facilities', 'events']
    }, 'Gallery images retrieved successfully');
    
  } catch (error) {
    console.error('Get gallery error:', error);
    sendError(res, 'Failed to get gallery images', 500);
  }
});

// Get news and announcements (public)
router.get('/news', async (req, res) => {
  try {
    // In a real application, you would fetch these from a database
    const news = [
      {
        id: 1,
        title: 'Admission Open for Academic Year 2024-25',
        content: 'Applications are now open for admission to all classes. Early bird discount available until March 31st.',
        publishDate: new Date('2024-01-15'),
        type: 'admission',
        isImportant: true
      },
      {
        id: 2,
        title: 'Annual Science Exhibition',
        content: 'Join us for our annual science exhibition on February 20th, 2024. Students will showcase innovative projects.',
        publishDate: new Date('2024-02-01'),
        type: 'event',
        isImportant: false
      },
      {
        id: 3,
        title: 'Holiday Notice',
        content: 'The institute will remain closed on March 10th due to local festival. Regular classes will resume on March 11th.',
        publishDate: new Date('2024-03-05'),
        type: 'notice',
        isImportant: true
      }
    ];
    
    // Sort by publish date (newest first)
    const sortedNews = news.sort((a, b) => b.publishDate - a.publishDate);
    
    sendSuccess(res, sortedNews, 'News and announcements retrieved successfully');
    
  } catch (error) {
    console.error('Get news error:', error);
    sendError(res, 'Failed to get news', 500);
  }
});

// Admin: Get all contact messages
router.get('/admin/contacts', authenticate, adminOnly, async (req, res) => {
  try {
    const { status, search } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);
    
    // Build query
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      const searchQuery = buildSearchQuery(search, ['name', 'email', 'subject']);
      query = { ...query, ...searchQuery };
    }
    
    // Get total count
    const total = await Contact.countDocuments(query);
    
    // Get contacts
    const contacts = await Contact.find(query)
      .populate('respondedBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    sendSuccess(res, {
      contacts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    }, 'Contact messages retrieved successfully');
    
  } catch (error) {
    console.error('Get contacts error:', error);
    sendError(res, 'Failed to get contact messages', 500);
  }
});

// Admin: Get single contact message
router.get('/admin/contacts/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('respondedBy', 'email');
    
    if (!contact) {
      return sendError(res, 'Contact message not found', 404);
    }
    
    sendSuccess(res, contact, 'Contact message retrieved successfully');
    
  } catch (error) {
    console.error('Get contact error:', error);
    sendError(res, 'Failed to get contact message', 500);
  }
});

// Admin: Respond to contact message
router.post('/admin/contacts/:id/respond', authenticate, adminOnly, async (req, res) => {
  try {
    const { response } = req.body;
    
    if (!response || response.trim().length === 0) {
      return sendError(res, 'Response message is required', 400);
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return sendError(res, 'Contact message not found', 404);
    }
    
    // Update contact message
    contact.status = 'Resolved';
    contact.adminResponse = sanitizeInput(response);
    contact.respondedAt = new Date();
    contact.respondedBy = req.user._id;
    await contact.save();
    
    // Send email response
    try {
      await sendContactResponseEmail(contact, response);
    } catch (emailError) {
      console.error('Failed to send contact response email:', emailError);
    }
    
    sendSuccess(res, contact, 'Response sent successfully');
    
  } catch (error) {
    console.error('Respond to contact error:', error);
    sendError(res, 'Failed to send response', 500);
  }
});

// Admin: Update contact message status
router.patch('/admin/contacts/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['New', 'In Progress', 'Resolved'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return sendError(res, 'Contact message not found', 404);
    }
    
    contact.status = status;
    await contact.save();
    
    sendSuccess(res, { status: contact.status }, 'Status updated successfully');
    
  } catch (error) {
    console.error('Update contact status error:', error);
    sendError(res, 'Failed to update status', 500);
  }
});

export default router;
