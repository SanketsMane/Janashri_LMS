import React, { useState } from 'react';
import Sidebar from '../../components/student/Sidebar';
import TopNavbar from '../../components/student/TopNavbar';

const StudentLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={handleSidebarToggle}
        onClose={handleSidebarClose}
        onCollapse={handleSidebarCollapse}
      />
      
      {/* Main Content Area */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
        {/* Top Navbar */}
        <TopNavbar onSidebarToggle={handleSidebarToggle} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
