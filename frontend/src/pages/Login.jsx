import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    studentId: '',
    password: '',
    loginType: 'student' // 'student' or 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { adminLogin, studentLogin, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    clearError();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (formData.loginType === 'admin') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      }
    } else {
      if (!formData.email && !formData.studentId) {
        newErrors.login = 'Either email or student ID is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    let result;
    
    if (formData.loginType === 'admin') {
      result = await adminLogin({
        email: formData.email,
        password: formData.password
      });
    } else {
      result = await studentLogin({
        email: formData.email || undefined,
        studentId: formData.studentId || undefined,
        password: formData.password
      });
    }
    
    if (result.success) {
      const redirectPath = result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/jnana-siri-logo.png" 
                alt="Jnana Siri Educational Institute" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">Jnana Siri</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            go back to home
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Login Type Toggle */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, loginType: 'student', email: '', studentId: '' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                    formData.loginType === 'student'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, loginType: 'admin', email: '', studentId: '' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border ${
                    formData.loginType === 'admin'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Email (for admin) or Email/Student ID (for student) */}
            {formData.loginType === 'admin' ? (
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="studentId" className="form-label">
                    Student ID (Optional)
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    className={`form-input ${errors.login ? 'border-red-500' : ''}`}
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g., STU0001"
                  />
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  OR
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email address (Optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`form-input ${errors.login ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.login && <p className="mt-1 text-sm text-red-600">{errors.login}</p>}
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/admission"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Apply for admission
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Check your{' '}
                <Link
                  to="/admission-status"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  admission status
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
