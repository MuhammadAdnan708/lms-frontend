import React, { useEffect, useState } from 'react';
import { courseService, enrollmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InstructorAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          courseService.getInstructor(),
          enrollmentService.getAllEnrollments()
        ]);
        setCourses(coursesRes.data);
        const instructorEnrollments = enrollmentsRes.data.filter(
          e => coursesRes.data.some(c => c._id === e.course?._id)
        );
        setEnrollments(instructorEnrollments);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * (c.enrolledStudents?.length || 0)), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);

  const topCourses = [...courses]
    .sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0))
    .slice(0, 5);

  const recentEnrollments = enrollments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const categoryData = courses.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + (c.enrolledStudents?.length || 0);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="page-container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Track your course performance and student engagement</p>
      </div>

      {/* Overview Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(22, 45, 89, 0.1)', color: 'var(--primary-blue)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 127, 64, 0.1)', color: 'var(--accent-orange)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(22, 45, 89, 0.1)', color: 'var(--primary-blue)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="stat-value">${totalRevenue}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 127, 64, 0.1)', color: 'var(--accent-orange)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <div className="stat-value">{totalLessons}</div>
            <div className="stat-label">Total Lessons</div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Top Performing Courses */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Top Performing Courses</h5>
              {topCourses.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {topCourses.map((course, index) => (
                    <div key={course._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        background: index === 0 ? 'var(--accent-orange)' : 'var(--primary-blue)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: 'var(--primary-blue)' }}>{course.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {course.enrolledStudents?.length || 0} students • ${course.price * (course.enrolledStudents?.length || 0)} revenue
                        </div>
                      </div>
                      <div style={{ 
                        width: '80px', 
                        height: '8px', 
                        borderRadius: '4px', 
                        background: 'var(--bg-light)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${Math.min(100, ((course.enrolledStudents?.length || 0) / (topCourses[0].enrolledStudents?.length || 1)) * 100)}%`, 
                          height: '100%', 
                          background: index === 0 ? 'var(--accent-orange)' : 'var(--primary-blue)',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No courses yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Students by Category</h5>
              {Object.keys(categoryData).length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {Object.entries(categoryData).map(([category, count]) => (
                    <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '100px', 
                        fontWeight: '500', 
                        color: 'var(--primary-blue)',
                        fontSize: '14px'
                      }}>
                        {category}
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          flex: 1, 
                          height: '24px', 
                          borderRadius: '6px', 
                          background: 'var(--bg-light)',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${(count / totalStudents) * 100}%`, 
                            height: '100%', 
                            background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-orange) 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '8px'
                          }}>
                            <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>{count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="card">
        <div className="card-body">
          <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Recent Enrollments</h5>
          {recentEnrollments.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '50%', 
                            background: 'var(--primary-blue)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600'
                          }}>
                            {enrollment.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span style={{ fontWeight: '500' }}>{enrollment.user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>{enrollment.course?.title || 'Unknown Course'}</td>
                      <td>{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                      <td style={{ color: 'var(--accent-orange)', fontWeight: '600' }}>${enrollment.course?.price || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No enrollments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
