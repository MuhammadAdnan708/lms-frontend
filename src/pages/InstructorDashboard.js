import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseService.getInstructor();
        setCourses(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        setCourses(courses.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * (c.enrolledStudents?.length || 0)), 0);

  const DashboardContent = () => (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>Instructor Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Welcome back, {user?.name}!</p>
        </div>
        <Link to="/instructor/create-course" className="btn btn-accent">
          + Create New Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(22, 45, 89, 0.1)', color: 'var(--primary-blue)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 127, 64, 0.1)', color: 'var(--accent-orange)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(22, 45, 89, 0.1)', color: 'var(--primary-blue)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-value">${totalRevenue}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)', color: 'white' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Create New Course</h5>
            <p style={{ opacity: 0.8, marginBottom: '1rem' }}>Start teaching and share your knowledge with students worldwide</p>
            <Link to="/instructor/create-course" className="btn" style={{ background: 'white', color: 'var(--primary-blue)', fontWeight: '600', alignSelf: 'flex-start' }}>
              Get Started
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card" style={{ padding: '1.5rem' }}>
            <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>View Analytics</h5>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Track your course performance and student engagement</p>
            <Link to="/instructor/analytics" className="btn btn-outline-primary" style={{ alignSelf: 'flex-start' }}>
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Manage Courses Table */}
      <div className="card">
        <div className="card-body">
          <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Manage Courses</h5>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Lessons</th>
                    <th>Students</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={course.thumbnail || defaultImage}
                            alt=""
                            className="rounded"
                            style={{ width: '60px', height: '40px', objectFit: 'cover', marginRight: '0.75rem' }}
                            onError={(e) => { e.target.src = defaultImage; }}
                          />
                          <span style={{ fontWeight: '500' }}>{course.title}</span>
                        </div>
                      </td>
                      <td><span className="badge bg-secondary">{course.category}</span></td>
                      <td>${course.price}</td>
                      <td>{course.lessons?.length || 0}</td>
                      <td>{course.enrolledStudents?.length || 0}</td>
                      <td>${course.price * (course.enrolledStudents?.length || 0)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link 
                            to={`/instructor/edit-course/${course._id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </Link>
                          <button 
                            className="btn btn-sm"
                            style={{ background: '#dc3545', color: 'white' }}
                            onClick={() => handleDelete(course._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>No courses yet</h5>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create your first course and start teaching!</p>
              <Link to="/instructor/create-course" className="btn btn-accent">
                Create Your First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default InstructorDashboard;
