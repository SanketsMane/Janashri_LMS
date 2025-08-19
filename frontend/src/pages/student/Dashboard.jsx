import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import {
  BookOpenIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon,
  BookmarkIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Quick stats data
  const quickStats = [
    { 
      icon: BookOpenIcon, 
      label: 'Courses Enrolled', 
      value: '8',
      subtext: '2 in progress',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      icon: DocumentTextIcon, 
      label: 'Exams Scheduled', 
      value: '3',
      subtext: 'Next: Math (2 days)',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      icon: BuildingLibraryIcon, 
      label: 'Books in Library', 
      value: '12',
      subtext: '3 due this week',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      icon: TrophyIcon, 
      label: 'Achievements', 
      value: '24',
      subtext: '+2 this month',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'course',
      title: 'Started Advanced JavaScript',
      description: 'Chapter 1: Async Programming',
      time: '2 hours ago',
      icon: PlayIcon,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'exam',
      title: 'Mathematics Exam',
      description: 'Scheduled for Dec 25, 2024',
      time: '1 day ago',
      icon: DocumentTextIcon,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      type: 'library',
      title: 'Borrowed: Data Structures',
      description: 'Due: Jan 5, 2025',
      time: '3 days ago',
      icon: BookmarkIcon,
      color: 'bg-emerald-500'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Quiz Master Badge',
      description: 'Scored 100% in Python Quiz',
      time: '1 week ago',
      icon: TrophyIcon,
      color: 'bg-yellow-500'
    }
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      date: 'Dec 25, 2024',
      time: '10:00 AM',
      type: 'exam',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Physics Lab Session',
      date: 'Dec 23, 2024',
      time: '2:00 PM',
      type: 'lab',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Library Book Due',
      date: 'Dec 22, 2024',
      time: 'End of day',
      type: 'library',
      priority: 'low'
    }
  ];

  // Course progress data
  const courseProgress = [
    { name: 'JavaScript Fundamentals', progress: 85, color: 'bg-blue-500' },
    { name: 'React Development', progress: 62, color: 'bg-emerald-500' },
    { name: 'Database Management', progress: 91, color: 'bg-purple-500' },
    { name: 'Web Security', progress: 34, color: 'bg-orange-500' }
  ];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 rounded-3xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                    </h1>
                    <p className="text-white/90 text-lg mt-1">
                      Ready to continue your learning journey?
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Student ID:</span>
                    <span>{user?.student_id || 'Loading...'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-sm font-medium">
                      {user?.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/student/courses"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-6 py-3 rounded-xl font-medium flex items-center space-x-2"
                >
                  <BookOpenIcon className="w-5 h-5" />
                  <span>Browse Courses</span>
                </Link>
                <Link
                  to="/student/profile"
                  className="bg-white text-blue-600 hover:bg-gray-100 transition-all px-6 py-3 rounded-xl font-medium flex items-center space-x-2"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>View Profile</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Background Decorations */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-yellow-300/20 rounded-full blur-2xl"></div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.subtext}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{stat.label}</h3>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Progress & Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Course Progress</h2>
                <Link 
                  to="/student/courses"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm"
                >
                  <span>View All</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {courseProgress.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${course.color} rounded-full h-2 transition-all duration-500`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Events & Quick Actions */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
                <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{event.date} at {event.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.priority === 'high' ? 'bg-red-100 text-red-700' :
                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/student/id-card"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors text-blue-600 border border-blue-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Generate ID Card</span>
                </Link>
                
                <Link
                  to="/student/library"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-emerald-50 rounded-xl transition-colors text-emerald-600 border border-emerald-200"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BuildingLibraryIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Browse Library</span>
                </Link>
                
                <Link
                  to="/student/exams"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 rounded-xl transition-colors text-purple-600 border border-purple-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">View Exams</span>
                </Link>
                
                <Link
                  to="/student/settings"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors text-gray-600 border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Account Settings</span>
                </Link>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FireIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Great Progress!</h3>
                  <p className="text-sm text-white/90">Keep up the excellent work</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Performance</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Assignments</span>
                  <span className="font-bold">24/28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Study Streak</span>
                  <span className="font-bold">12 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
