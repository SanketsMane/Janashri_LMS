import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../utils/api';
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const AccountSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    academicUpdates: true,
    examReminders: true,
    feeReminders: true,
    generalAnnouncements: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    contactVisibility: 'limited',
    academicInfoVisibility: 'private'
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      setLoading(true);
      await studentAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      alert('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (key, value) => {
    try {
      const updatedSettings = { ...notificationSettings, [key]: value };
      setNotificationSettings(updatedSettings);
      
      await studentAPI.updateNotificationSettings(updatedSettings);
      // Note: You might want to show a success message here
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Revert the change if API call fails
      setNotificationSettings(notificationSettings);
    }
  };

  const handlePrivacyUpdate = async (key, value) => {
    try {
      const updatedSettings = { ...privacySettings, [key]: value };
      setPrivacySettings(updatedSettings);
      
      await studentAPI.updatePrivacySettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      setPrivacySettings(privacySettings);
    }
  };

  const tabs = [
    {
      id: 'security',
      name: 'Security',
      icon: ShieldCheckIcon,
      description: 'Manage your password and security settings'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: BellIcon,
      description: 'Control what notifications you receive'
    },
    {
      id: 'privacy',
      name: 'Privacy',
      icon: EyeIcon,
      description: 'Manage your profile visibility and privacy'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <CogIcon className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-neutral-900">Account Settings</h1>
          </div>
          <p className="text-neutral-600">Manage your account preferences and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{tab.name}</div>
                          <div className="text-sm text-neutral-500">{tab.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-neutral-900">Security Settings</h2>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="input-field pr-12"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword.current ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="input-field pr-12"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="input-field pr-12"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        <LockClosedIcon className="w-5 h-5 mr-2" />
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <BellIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-neutral-900">Notification Preferences</h2>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-neutral-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {getNotificationDescription(key)}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationUpdate(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <EyeIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-neutral-900">Privacy Settings</h2>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(privacySettings).map(([key, value]) => (
                      <div key={key} className="p-4 bg-neutral-50 rounded-xl">
                        <h3 className="font-medium text-neutral-900 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-3">
                          {getPrivacyDescription(key)}
                        </p>
                        <select
                          value={value}
                          onChange={(e) => handlePrivacyUpdate(key, e.target.value)}
                          className="input-field"
                        >
                          <option value="public">Public</option>
                          <option value="limited">Limited</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getNotificationDescription = (key) => {
  const descriptions = {
    emailNotifications: 'Receive notifications via email',
    smsNotifications: 'Receive notifications via SMS',
    academicUpdates: 'Get notified about academic announcements',
    examReminders: 'Receive exam schedule and reminders',
    feeReminders: 'Get notified about fee payments',
    generalAnnouncements: 'Receive general institute announcements'
  };
  return descriptions[key] || 'Manage this notification setting';
};

const getPrivacyDescription = (key) => {
  const descriptions = {
    profileVisibility: 'Control who can see your profile information',
    contactVisibility: 'Manage visibility of your contact details',
    academicInfoVisibility: 'Control access to your academic information'
  };
  return descriptions[key] || 'Manage this privacy setting';
};

export default AccountSettings;
