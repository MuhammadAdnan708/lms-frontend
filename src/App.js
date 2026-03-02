import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorAnalytics from './pages/InstructorAnalytics';
import AdminDashboard from './pages/AdminDashboard';
import EnrollUser from './pages/EnrollUser';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Instructor Routes */}
          <Route 
            path="/instructor/dashboard" 
            element={
              <ProtectedRoute role="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/create-course" 
            element={
              <ProtectedRoute role="instructor">
                <CreateCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/edit-course/:id" 
            element={
              <ProtectedRoute role="instructor">
                <EditCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/analytics" 
            element={
              <ProtectedRoute role="instructor">
                <InstructorAnalytics />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/enrollments" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/enroll-user" 
            element={
              <ProtectedRoute role="admin">
                <EnrollUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/create-course" 
            element={
              <ProtectedRoute role="admin">
                <CreateCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-course/:id" 
            element={
              <ProtectedRoute role="admin">
                <EditCourse />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
