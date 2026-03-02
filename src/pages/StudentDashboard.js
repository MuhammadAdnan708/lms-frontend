import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await enrollmentService.getMyCourses();
        setEnrollments(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";

  const totalProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const DashboardContent = () => (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>My Learning</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Welcome back, {user?.name}!</p>
        </div>
        <Link to="/courses" className="btn btn-accent">
          Browse More Courses
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(22, 45, 89, 0.1)', color: 'var(--primary-blue)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className="stat-value">{enrollments.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 127, 64, 0.1)', color: 'var(--accent-orange)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-value">{totalProgress}%</div>
            <div className="stat-label">Average Progress</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(22, 45, 89, 0.1)', color: 'var(--primary-blue)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
            <div className="stat-value">{enrollments.filter(e => (e.progress || 0) === 100).length}</div>
            <div className="stat-label">Completed Courses</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="card">
        <div className="card-body">
          <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>My Courses</h5>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : enrollments.length > 0 ? (
            <div className="row g-4">
              {enrollments.map((enrollment) => (
                <div className="col-md-6 col-lg-4" key={enrollment._id}>
                  <div className="course-card">
                    <img 
                      src={enrollment.course?.thumbnail || defaultImage}
                      alt=""
                      className="card-img-top"
                      style={{ height: '160px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = defaultImage; }}
                    />
                    <div className="card-body">
                      <h6 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>{enrollment.course?.title}</h6>
                      <p className="text-muted small mb-2">
                        Instructor: {enrollment.course?.instructor?.name}
                      </p>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                          <span style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>{Math.round(enrollment.progress || 0)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-light)', borderRadius: '4px' }}>
                          <div 
                            style={{ 
                              width: `${enrollment.progress || 0}%`, 
                              height: '100%', 
                              background: (enrollment.progress || 0) === 100 ? '#28a745' : 'var(--accent-orange)',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease'
                            }}
                          ></div>
                        </div>
                      </div>
                      <Link 
                        to={`/courses/${enrollment.course?._id}`}
                        className="btn btn-sm btn-primary w-100"
                      >
                        {(enrollment.progress || 0) === 0 ? 'Start Learning' : 'Continue Learning'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>No courses yet</h5>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start your learning journey today!</p>
              <Link to="/courses" className="btn btn-accent">Browse Courses</Link>
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

export default StudentDashboard;
