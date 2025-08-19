import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import components
import Navbar from './components/Navbar';
import Loading from './components/Loading';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdmissionForm from './pages/AdmissionForm';
import AdmissionStatus from './pages/AdmissionStatus';
import Login from './pages/Login';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentIdCard from './pages/student/IdCard';
import AccountSettings from './pages/student/AccountSettings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAdmissions from './pages/admin/Admissions';
import AdminStudents from './pages/admin/Students';
import AdminContacts from './pages/admin/Contacts';

// Protected Route Components
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users to their dashboard
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />
      <Route path="/gallery" element={<AppLayout><Gallery /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
      <Route path="/admission" element={<AppLayout><AdmissionForm /></AppLayout>} />
      <Route path="/admission-status" element={<AppLayout><AdmissionStatus /></AppLayout>} />
      
      {/* Login Route (only for non-authenticated users) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Student Routes */}
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute requiredRole="student">
            <AppLayout><StudentDashboard /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/profile" 
        element={
          <ProtectedRoute requiredRole="student">
            <AppLayout><StudentProfile /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/id-card" 
        element={
          <ProtectedRoute requiredRole="student">
            <AppLayout><StudentIdCard /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/settings" 
        element={
          <ProtectedRoute requiredRole="student">
            <AppLayout><AccountSettings /></AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/admissions" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout><AdminAdmissions /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/students" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout><AdminStudents /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/contacts" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout><AdminContacts /></AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
