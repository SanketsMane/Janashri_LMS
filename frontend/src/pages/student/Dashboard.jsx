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

  // TODO: Replace with actual API calls
  // Quick stats data - these would come from API
  const quickStats = [
    { 
      icon: BookOpenIcon, 
      label: 'Courses Enrolled', 
      value: user?.courses?.length || '0',
      subtext: user?.courses?.filter(c => c.status === 'in_progress')?.length || '0' + ' in progress',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      icon: DocumentTextIcon, 
      label: 'Exams Scheduled', 
      value: user?.upcoming_exams?.length || '0',
      subtext: user?.upcoming_exams?.[0] ? `Next: ${user.upcoming_exams[0].subject}` : 'No upcoming exams',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      icon: BuildingLibraryIcon, 
      label: 'Library Books', 
      value: user?.library_books?.length || '0',
      subtext: user?.library_books?.filter(b => b.due_soon)?.length || '0' + ' due soon',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      icon: TrophyIcon, 
      label: 'Achievements', 
      value: user?.achievements?.length || '0',
      subtext: 'Keep learning to earn more',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  // Recent activities - would come from API
  const recentActivities = user?.recent_activities || [];

  // Upcoming events - would come from API
  const upcomingEvents = user?.upcoming_events || [];

  // Course progress - would come from API
  const courseProgress = user?.course_progress || [];

  return (
    <StudentLayout>
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 lg:space-x-4 mb-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center">
                    <span className="text-lg lg:text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">
                      Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                    </h1>
                    <p className="text-white/90 text-base lg:text-lg mt-1">
                      Ready to continue your learning journey?
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-white/90 text-sm lg:text-base">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Student ID:</span>
                    <span>{user?.student_id || 'Loading...'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-medium">
                      {user?.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/student/courses"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                  <BookOpenIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Browse Courses</span>
                </Link>
                <Link
                  to="/student/profile"
                  className="bg-white text-blue-600 hover:bg-gray-100 transition-all px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                  <SparklesIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>View Profile</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Background Decorations */}
          <div className="absolute -top-10 -right-10 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 lg:w-40 lg:h-40 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 lg:w-20 lg:h-20 bg-yellow-300/20 rounded-full blur-2xl"></div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.bgColor} rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.subtext}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{stat.label}</h3>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Course Progress & Recent Activity */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Course Progress */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Course Progress</h2>
                <Link 
                  to="/student/courses"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm"
                >
                  <span>View All</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {courseProgress.length > 0 ? (
                  courseProgress.map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm lg:text-base">{course.name}</h4>
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No courses enrolled yet</p>
                    <p className="text-sm text-gray-400 mt-1">Browse our course catalog to get started</p>
                    <Link
                      to="/student/courses"
                      className="inline-flex items-center space-x-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Browse Courses</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 ${activity.color} rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm lg:text-base">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">Start exploring courses to see your activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Events & Quick Actions */}
          <div className="space-y-6 lg:space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
                <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="space-y-3 lg:space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-500 pl-3 lg:pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming events</p>
                    <p className="text-sm text-gray-400 mt-1">Your schedule is clear for now</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/student/id-card"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors text-blue-600 border border-blue-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Generate ID Card</span>
                </Link>
                
                <Link
                  to="/student/library"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-emerald-50 rounded-xl transition-colors text-emerald-600 border border-emerald-200"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BuildingLibraryIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Browse Library</span>
                </Link>
                
                <Link
                  to="/student/exams"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 rounded-xl transition-colors text-purple-600 border border-purple-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">View Exams</span>
                </Link>
                
                <Link
                  to="/student/settings"
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors text-gray-600 border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Account Settings</span>
                </Link>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <FireIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm lg:text-base">
                    {user?.performance ? 'Great Progress!' : 'Welcome!'}
                  </h3>
                  <p className="text-xs lg:text-sm text-white/90">
                    {user?.performance ? 'Keep up the excellent work' : 'Start learning to track your progress'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm">Overall Performance</span>
                  <span className="font-bold text-sm lg:text-base">
                    {user?.performance?.overall || '--'}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm">Completed Assignments</span>
                  <span className="font-bold text-sm lg:text-base">
                    {user?.performance?.completed_assignments || '0'}/{user?.performance?.total_assignments || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm">Study Streak</span>
                  <span className="font-bold text-sm lg:text-base">
                    {user?.performance?.study_streak || '0'} days
                  </span>
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
