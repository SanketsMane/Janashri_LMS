import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, publicAPI } from '../../utils/api';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingAdmissions: 0,
    totalContacts: 0,
    approvedAdmissions: 0,
    totalCourses: 0,
    totalBooks: 0,
    totalExams: 0,
    totalTickets: 0,
    totalGalleryImages: 0
  });
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admissions data
      const admissionsResponse = await adminAPI.getAdmissions({ limit: 5 });
      const admissions = admissionsResponse.data.admissions || [];
      
      // Fetch students data
      const studentsResponse = await adminAPI.getStudents({ limit: 5 });
      const students = studentsResponse.data.students || [];
      
      // Fetch contacts data
      const contactsResponse = await publicAPI.getContacts({ limit: 5 });
      const contacts = contactsResponse.data.contacts || [];

      // Fetch gallery data
      const galleryResponse = await fetch('/api/gallery');
      const galleryData = await galleryResponse.json();
      const galleryImages = galleryData.success ? galleryData.data.images : [];

      // Calculate statistics
      const pendingAdmissions = admissions.filter(a => a.status === 'pending').length;
      const approvedAdmissions = admissions.filter(a => a.status === 'approved').length;

      // TODO: Add API calls for new features when backend is ready
      // const coursesResponse = await adminAPI.getCourses();
      // const booksResponse = await adminAPI.getBooks();
      // const examsResponse = await adminAPI.getExams();
      // const ticketsResponse = await adminAPI.getSupportTickets();
      // const galleryResponse = await adminAPI.getGalleryImages();

      setStats({
        totalStudents: students.length,
        pendingAdmissions: pendingAdmissions,
        totalContacts: contacts.length,
        approvedAdmissions: approvedAdmissions,
        totalCourses: 0, // TODO: Replace with coursesResponse.data.courses.length
        totalBooks: 0, // TODO: Replace with booksResponse.data.books.length
        totalExams: 0, // TODO: Replace with examsResponse.data.exams.length
        totalTickets: 0, // TODO: Replace with ticketsResponse.data.tickets.length
        totalGalleryImages: galleryImages.length
      });

      setRecentAdmissions(admissions);
      setRecentContacts(contacts);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        totalStudents: 0,
        pendingAdmissions: 0,
        totalContacts: 0,
        approvedAdmissions: 0,
        totalCourses: 0,
        totalBooks: 0,
        totalExams: 0,
        totalTickets: 0,
        totalGalleryImages: 0
      });
      setRecentAdmissions([]);
      setRecentContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Admissions Management',
      description: 'Review and process admission applications with detailed student information',
      icon: ClipboardDocumentListIcon,
      link: '/admin/admissions',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      count: stats.pendingAdmissions,
      label: 'Pending Reviews'
    },
    {
      title: 'Student Management',
      description: 'View, edit, and manage all registered students and their academic records',
      icon: UserGroupIcon,
      link: '/admin/students',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      count: stats.totalStudents,
      label: 'Total Students'
    },
    {
      title: 'Course Management',
      description: 'Create, edit, and organize courses, curriculum, and learning materials',
      icon: BookOpenIcon,
      link: '/admin/courses',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      count: stats.totalCourses || 0,
      label: 'Available Courses'
    },
    {
      title: 'Library Management',
      description: 'Manage books, resources, and digital library content for students',
      icon: BuildingLibraryIcon,
      link: '/admin/library',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      count: stats.totalBooks || 0,
      label: 'Library Books'
    },
    {
      title: 'Exam Management',
      description: 'Schedule exams, manage questions, and oversee student assessments',
      icon: DocumentTextIcon,
      link: '/admin/exams',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      count: stats.totalExams || 0,
      label: 'Active Exams'
    },
    {
      title: 'Help & Support',
      description: 'Manage help documentation, FAQs, and provide student support',
      icon: QuestionMarkCircleIcon,
      link: '/admin/help',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      count: stats.totalTickets || 0,
      label: 'Support Tickets'
    },
    {
      title: 'Gallery Management',
      description: 'Upload, organize, and manage website gallery images and media',
      icon: PhotoIcon,
      link: '/admin/gallery',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      count: stats.totalGalleryImages || 0,
      label: 'Gallery Images'
    },
    {
      title: 'Contact Management',
      description: 'Handle inquiries and communications from prospective students and parents',
      icon: PhoneIcon,
      link: '/admin/contacts',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      count: stats.totalContacts,
      label: 'Active Inquiries'
    },
    {
      title: 'Analytics & Reports',
      description: 'Generate comprehensive reports and view system analytics dashboard',
      icon: ChartBarIcon,
      link: '/admin/analytics',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      count: '12+',
      label: 'Report Types'
    }
  ];

  const quickStats = [
    { 
      icon: UserGroupIcon, 
      label: 'Total Students', 
      value: stats.totalStudents, 
      change: '+12%',
      changeType: 'positive',
      color: 'text-primary-600' 
    },
    { 
      icon: ClipboardDocumentListIcon, 
      label: 'Pending Applications', 
      value: stats.pendingAdmissions, 
      change: '+5',
      changeType: 'neutral',
      color: 'text-warning' 
    },
    { 
      icon: CheckCircleIcon, 
      label: 'Approved This Month', 
      value: stats.approvedAdmissions, 
      change: '+18%',
      changeType: 'positive',
      color: 'text-success' 
    },
    { 
      icon: PhoneIcon, 
      label: 'Contact Inquiries', 
      value: stats.totalContacts, 
      change: '+7',
      changeType: 'positive',
      color: 'text-secondary-600' 
    }
  ];

  // Generate recent activities from real data
  const generateRecentActivities = () => {
    const activities = [];
    
    // Add recent admissions as activities
    recentAdmissions.slice(0, 3).forEach(admission => {
      activities.push({
        icon: admission.status === 'approved' ? CheckCircleIcon : 
              admission.status === 'rejected' ? XCircleIcon : ClipboardDocumentListIcon,
        title: admission.status === 'approved' ? 'Application Approved' :
               admission.status === 'rejected' ? 'Application Rejected' : 'New Application',
        description: `${admission.name} - ${admission.course}`,
        time: new Date(admission.submittedAt).toLocaleDateString(),
        type: admission.status === 'approved' ? 'success' :
              admission.status === 'rejected' ? 'error' : 'info'
      });
    });
    
    // Add recent contacts as activities
    recentContacts.slice(0, 2).forEach(contact => {
      activities.push({
        icon: PhoneIcon,
        title: 'Contact Inquiry',
        description: `${contact.name} - ${contact.subject}`,
        time: new Date(contact.createdAt).toLocaleDateString(),
        type: 'neutral'
      });
    });
    
    return activities.slice(0, 5); // Return max 5 activities
  };

  const recentActivities = generateRecentActivities();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Admin Header */}
        <div className="mb-12">
          <div className="card p-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      Admin Dashboard
                    </h1>
                    <p className="text-white/90 text-lg">
                      Welcome back, {user?.name || user?.email || 'Administrator'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                  <div className="text-white/90">System Status: Active</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-white/90">
                <ArrowTrendingUpIcon className="w-5 h-5" />
                <span>System performance optimal • All services running smoothly</span>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-300/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="dashboard-card group">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' ? 'text-success bg-green-100' :
                    stat.changeType === 'negative' ? 'text-error bg-red-100' :
                    'text-neutral-600 bg-neutral-100'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="dashboard-stat mb-1">{stat.value}</div>
                <div className="dashboard-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Dashboard Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Management Centers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  to={card.link}
                  className="card group hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-lg transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-neutral-900">{card.count}</div>
                        <div className="text-xs text-neutral-500">{card.label}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-6 text-sm">
                      {card.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">Manage</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">Recent Activity</h3>
              <Link to="/admin/activity" className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'success' ? 'bg-success text-white' :
                      activity.type === 'error' ? 'bg-error text-white' :
                      activity.type === 'info' ? 'bg-primary-600 text-white' :
                      'bg-neutral-400 text-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{activity.title}</p>
                      <p className="text-sm text-neutral-600">{activity.description}</p>
                    </div>
                    <span className="text-sm text-neutral-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
