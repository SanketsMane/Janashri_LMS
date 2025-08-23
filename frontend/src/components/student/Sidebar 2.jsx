import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  IdentificationIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onToggle, onClose, onCollapse }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      href: '/student/dashboard',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      name: 'Courses',
      icon: BookOpenIcon,
      href: '/student/courses',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      name: 'Library',
      icon: BuildingLibraryIcon,
      href: '/student/library',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      name: 'Exams',
      icon: DocumentTextIcon,
      href: '/student/exams',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      name: 'Profile',
      icon: UserIcon,
      href: '/student/profile',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      name: 'ID Card',
      icon: IdentificationIcon,
      href: '/student/id-card',
      color: 'text-orange-600 bg-orange-50',
    },
    {
      name: 'Settings',
      icon: CogIcon,
      href: '/student/settings',
      color: 'text-gray-600 bg-gray-50',
    },
    {
      name: 'Help',
      icon: QuestionMarkCircleIcon,
      href: '/student/help',
      color: 'text-green-600 bg-green-50',
    },
  ];

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-20' : 'w-72'}
          lg:translate-x-0 lg:z-30
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/jnana-siri-logo.png" 
                  alt="Jnana Siri Educational Institute" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-extrabold text-gray-900 leading-tight tracking-wide">Jnana Siri</h2>
                <p className="text-xs font-medium text-gray-500 leading-tight tracking-wider uppercase">Learning Portal</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={handleToggleCollapse}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
            
            {/* Close Button (Mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon 
                  className={`
                    w-6 h-6 flex-shrink-0 transition-colors
                    ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}
                  `} 
                />
                {!isCollapsed && (
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                )}
                
                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Need Help?</p>
                  <p className="text-xs text-gray-600">Get support instantly</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
