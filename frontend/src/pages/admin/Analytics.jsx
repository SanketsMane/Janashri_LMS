import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  PhotoIcon,
  CalendarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 0,
      totalAdmissions: 0,
      totalContacts: 0,
      totalGalleryImages: 0,
      monthlyGrowth: 0,
      activeUsers: 0
    },
    admissionsTrend: [],
    contactsTrend: [],
    topCategories: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from various APIs
      const [admissionsRes, contactsRes, galleryRes] = await Promise.all([
        fetch('/api/admin/admissions', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/public/contacts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/gallery')
      ]);

      const admissions = admissionsRes.ok ? (await admissionsRes.json()).data?.admissions || [] : [];
      const contacts = contactsRes.ok ? (await contactsRes.json()).data?.contacts || [] : [];
      const gallery = galleryRes.ok ? (await galleryRes.json()).data?.images || [] : [];

      // Process data for analytics
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

      const recentAdmissions = admissions.filter(a => new Date(a.createdAt) > thirtyDaysAgo);
      const recentContacts = contacts.filter(c => new Date(c.createdAt) > thirtyDaysAgo);
      const recentGallery = gallery.filter(g => new Date(g.createdAt) > thirtyDaysAgo);

      // Calculate trends
      const admissionsTrend = calculateTrend(admissions, 'createdAt');
      const contactsTrend = calculateTrend(contacts, 'createdAt');

      // Top categories from gallery
      const categoryCount = gallery.reduce((acc, img) => {
        acc[img.category] = (acc[img.category] || 0) + 1;
        return acc;
      }, {});
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Recent activity
      const recentActivity = [
        ...recentAdmissions.map(a => ({
          type: 'admission',
          title: `New admission: ${a.firstName} ${a.lastName}`,
          time: new Date(a.createdAt),
          status: a.status
        })),
        ...recentContacts.map(c => ({
          type: 'contact',
          title: `Contact inquiry: ${c.name}`,
          time: new Date(c.createdAt),
          status: 'new'
        })),
        ...recentGallery.map(g => ({
          type: 'gallery',
          title: `New image: ${g.title}`,
          time: new Date(g.createdAt),
          status: 'active'
        }))
      ].sort((a, b) => b.time - a.time).slice(0, 10);

      setAnalyticsData({
        overview: {
          totalUsers: admissions.filter(a => a.status === 'approved').length,
          totalAdmissions: admissions.length,
          totalContacts: contacts.length,
          totalGalleryImages: gallery.length,
          monthlyGrowth: Math.round(((recentAdmissions.length / Math.max(admissions.length, 1)) * 100)),
          activeUsers: admissions.filter(a => a.status === 'approved').length
        },
        admissionsTrend,
        contactsTrend,
        topCategories,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (data, dateField) => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const count = data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= dayStart && itemDate <= dayEnd;
      }).length;
      
      last7Days.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }
    
    return last7Days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Analytics & Reports</h1>
              <p className="text-neutral-600 mt-2">Monitor your institute's performance and growth</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="btn btn-primary">
                <DocumentChartBarIcon className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Students</p>
                <p className="text-2xl font-bold text-neutral-900">{analyticsData.overview.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analyticsData.overview.monthlyGrowth}% this month</span>
                </div>
              </div>
              <UserGroupIcon className="w-10 h-10 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Admissions</p>
                <p className="text-2xl font-bold text-neutral-900">{analyticsData.overview.totalAdmissions}</p>
                <p className="text-sm text-neutral-500 mt-2">All time</p>
              </div>
              <ClipboardDocumentListIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Contact Inquiries</p>
                <p className="text-2xl font-bold text-neutral-900">{analyticsData.overview.totalContacts}</p>
                <p className="text-sm text-neutral-500 mt-2">Total received</p>
              </div>
              <PhoneIcon className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Gallery Images</p>
                <p className="text-2xl font-bold text-neutral-900">{analyticsData.overview.totalGalleryImages}</p>
                <p className="text-sm text-neutral-500 mt-2">Published</p>
              </div>
              <PhotoIcon className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Admissions Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Admissions Trend (Last 7 Days)</h3>
            <div className="space-y-3">
              {analyticsData.admissionsTrend.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{day.date}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((day.count / Math.max(...analyticsData.admissionsTrend.map(d => d.count), 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gallery Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Gallery Categories</h3>
            <div className="space-y-3">
              {analyticsData.topCategories.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 capitalize">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((category.count / Math.max(...analyticsData.topCategories.map(c => c.count), 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 w-8 text-right">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'admission' ? 'bg-blue-500' :
                  activity.type === 'contact' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                  <p className="text-xs text-neutral-500">{activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'approved' || activity.status === 'active' ? 'bg-green-100 text-green-700' :
                  activity.status === 'pending' || activity.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
