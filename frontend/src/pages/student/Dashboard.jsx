import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UserCircleIcon,
  IdentificationIcon,
  CogIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  BellIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Profile Management',
      description: 'Update your personal information, contact details, and academic records',
      icon: UserCircleIcon,
      link: '/student/profile',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    {
      title: 'Student ID Card',
      description: 'Generate and download your official student identification card',
      icon: IdentificationIcon,
      link: '/student/id-card',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-600'
    },
    {
      title: 'Account Settings',
      description: 'Manage account security, notifications, and privacy preferences',
      icon: CogIcon,
      link: '/student/settings',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const quickStats = [
    { icon: AcademicCapIcon, label: 'Academic Year', value: '2024-25', color: 'text-primary-600' },
    { icon: CalendarDaysIcon, label: 'Enrollment Date', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', color: 'text-secondary-600' },
    { icon: ChartBarIcon, label: 'Status', value: user?.status || 'Active', color: 'text-success' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="card p-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Welcome back, {user?.name || 'Student'}!
                  </h1>
                  <p className="text-white/90 text-lg">
                    Student ID: <span className="font-semibold">{user?.student_id || 'Loading...'}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-white/90">
                <BellIcon className="w-5 h-5" />
                <span>Good morning! Ready to continue your learning journey?</span>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-300/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="dashboard-card">
                <div className="flex items-center space-x-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="dashboard-label">{stat.label}</p>
                    <p className="dashboard-stat text-lg">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Dashboard Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mb-6 shadow-soft group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-6">
                      {card.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Get Started</span>
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
            <h3 className="text-xl font-bold text-neutral-900">Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">Profile Updated</p>
                  <p className="text-sm text-neutral-600">Your profile information has been successfully updated</p>
                </div>
                <span className="text-sm text-neutral-500">Today</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <IdentificationIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">Account Created</p>
                  <p className="text-sm text-neutral-600">Welcome to Janashiri Institute</p>
                </div>
                <span className="text-sm text-neutral-500">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
