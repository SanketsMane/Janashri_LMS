import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon,
  InformationCircleIcon,
  PhotoIcon,
  PhoneIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const publicNavItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
    { name: 'Gallery', path: '/gallery', icon: PhotoIcon },
    { name: 'Contact', path: '/contact', icon: PhoneIcon },
  ];

  const studentNavItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: HomeIcon },
    { name: 'Profile', path: '/student/profile', icon: UserCircleIcon },
    { name: 'ID Card', path: '/student/id-card', icon: ClipboardDocumentIcon },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'Admissions', path: '/admin/admissions', icon: ClipboardDocumentIcon },
    { name: 'Students', path: '/admin/students', icon: UserCircleIcon },
    { name: 'Contacts', path: '/admin/contacts', icon: PhoneIcon },
  ];

  const getNavItems = () => {
    if (!isAuthenticated) return publicNavItems;
    if (user?.role === 'admin') return adminNavItems;
    if (user?.role === 'student') return studentNavItems;
    return publicNavItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">J</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-neutral-800">Janashiri Institute</span>
              <span className="text-xs text-neutral-500 -mt-1">Excellence in Education</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 ${
                    location.pathname === item.path ? 'nav-link-active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/admission"
                  className="btn-primary"
                >
                  <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                  Apply Now
                </Link>
                <Link
                  to="/login"
                  className="btn-outline"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-neutral-50 px-4 py-2 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-800">
                      {user?.name || user?.email}
                    </span>
                    <span className="text-xs text-neutral-500 capitalize font-medium">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-error transition-all duration-200 px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu lg:hidden">
            <div className="mobile-sidebar">
              <div className="p-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-neutral-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-neutral-800">Janashiri</span>
                    <span className="text-xs text-neutral-500">Excellence in Education</span>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2 mb-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                            : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Auth Section */}
                <div className="pt-6 border-t border-neutral-200">
                  {!isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        to="/admission"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn-primary w-full justify-center"
                      >
                        <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                        Apply Now
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn-outline w-full justify-center"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                        Login
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft">
                          <span className="text-white font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-800">
                            {user?.name || user?.email}
                          </span>
                          <span className="text-sm text-neutral-500 capitalize">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 w-full p-3 text-error hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
