import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { userService, courseService, enrollmentService, contactService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'users', 'courses', 'enrollments', 'messages', 'requests'].includes(tab)) {
      setActiveTab(tab);
    } else if (!searchParams.get('tab')) {
      setActiveTab('overview');
    }
  }, [searchParams]);

  const fetchPendingInstructors = async () => {
    setPendingLoading(true);
    try {
      const res = await userService.getPendingInstructors();
      setPendingInstructors(res.data);
    } catch (err) {
      console.error('Error fetching pending instructors:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchPendingInstructors();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes, analyticsRes, enrollmentsRes, messagesRes] = await Promise.all([
        userService.getAll(),
        courseService.getAll(),
        userService.getAnalytics(),
        enrollmentService.getAllEnrollments(),
        contactService.getAllMessages()
      ]);
      setUsers(usersRes.data);
      setCourses(coursesRes.data.courses || coursesRes.data);
      setAnalytics(analyticsRes.data);
      setEnrollments(enrollmentsRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their data will be lost.')) {
      try {
        await userService.delete(id);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        setCourses(courses.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  const handleApproveInstructor = async (id) => {
    if (window.confirm('Approve this instructor? They will be able to login and create courses.')) {
      try {
        await userService.approveInstructor(id);
        setPendingInstructors(pendingInstructors.filter(i => i._id !== id));
        alert('Instructor approved successfully!');
      } catch (err) {
        alert('Failed to approve instructor');
      }
    }
  };

  const handleRejectInstructor = async (id) => {
    if (window.confirm('Reject this instructor request? Their account will be deleted.')) {
      try {
        await userService.rejectInstructor(id);
        setPendingInstructors(pendingInstructors.filter(i => i._id !== id));
        alert('Instructor request rejected');
      } catch (err) {
        alert('Failed to reject instructor');
      }
    }
  };

  const students = users.filter(u => u.role === 'student');
  const instructors = users.filter(u => u.role === 'instructor');
  const admins = users.filter(u => u.role === 'admin');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.instructor?.name?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const getCourseEnrollments = (courseId) => {
    return enrollments.filter(e => e.course?._id === courseId || e.course === courseId);
  };

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";

  const chartData = analytics?.monthlyRegistrations || [];
  const maxUsers = chartData.length > 0 ? Math.max(...chartData.map(d => d.users), 1) : 1;

  const DashboardContent = () => (
    <div className="page-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Welcome back, {user?.name}!</p>
        </div>
        <Link to="/admin/create-course" className="btn btn-accent">
          + Create New Course
        </Link>
      </div>

      {/* Tabs - Horizontal scroll on mobile */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
        {['overview', 'users', 'courses', 'enrollments', 'messages', 'requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: activeTab === tab ? 'linear-gradient(135deg, #22d3ee, #06b6d4)' : 'transparent',
              color: activeTab === tab ? '#0f172a' : 'var(--text-muted)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textTransform: 'capitalize',
              flexShrink: 0
            }}
          >
            {tab === 'overview' ? 'Overview' : tab === 'users' ? `Users (${users.length})` : tab === 'courses' ? `Courses (${courses.length})` : tab === 'messages' ? `Messages (${messages.filter(m => !m.isRead).length})` : tab === 'requests' ? `Requests` : 'Enrollments'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && analytics && (
            <div className="fade-in">
              {/* Stats Cards */}
              <div className="row g-3 g-md-4 mb-4">
                <div className="col-6 col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="stat-value">{analytics.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                    </div>
                    <div className="stat-value">{analytics.totalStudents}</div>
                    <div className="stat-label">Students</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <div className="stat-value">{analytics.totalInstructors}</div>
                    <div className="stat-label">Instructors</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    </div>
                    <div className="stat-value">{analytics.totalCourses}</div>
                    <div className="stat-label">Courses</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div className="stat-value">{analytics.totalEnrollments}</div>
                    <div className="stat-label">Enrollments</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', cursor: 'pointer' }} onClick={() => window.location.href = '/admin/enroll-user'}>
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                    </div>
                    <div className="stat-value" style={{ color: 'white' }}>+ Enroll</div>
                    <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Add New</div>
                  </div>
                </div>
              </div>

              {/* Analytics Chart */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Platform Analytics - Monthly User Registrations</h5>
                {chartData.length > 0 ? (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
                    {chartData.map((item, index) => (
                      <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '100%', 
                          height: `${Math.max((item.users / maxUsers) * 200, 10)}px`, 
                          background: 'linear-gradient(180deg, var(--accent-orange) 0%, var(--primary-blue) 100%)',
                          borderRadius: '8px 8px 0 0',
                          transition: 'height 0.3s ease'
                        }}></div>
                        <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.month}</div>
                        <div style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>{item.users}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">No registration data available yet</div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="card fade-in">
              <div className="card-body">
                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['', 'student', 'instructor', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      style={{
                        padding: '0.4rem 1rem',
                        border: '1px solid var(--border-color)',
                        background: roleFilter === role ? 'var(--primary-blue)' : 'white',
                        color: roleFilter === role ? 'white' : 'var(--text-muted)',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {role === '' ? `All (${users.length})` : role === 'student' ? `Students (${students.length})` : role === 'instructor' ? `Instructors (${instructors.length})` : `Admins (${admins.length})`}
                    </button>
                  ))}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users by name or email..."
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Courses</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers
                        .filter(u => roleFilter === '' || u.role === roleFilter)
                        .map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                background: 'var(--primary-blue)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                marginRight: '0.75rem'
                              }}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              {u.name}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className="badge" style={{ 
                              background: u.role === 'admin' ? 'var(--primary-blue)' : u.role === 'instructor' ? 'var(--accent-orange)' : 'rgba(22, 45, 89, 0.1)',
                              color: u.role === 'admin' || u.role === 'instructor' ? 'white' : 'var(--primary-blue)'
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.role === 'instructor' ? courses.filter(c => c.instructor?._id === u._id).length : enrollments.filter(e => e.student?._id === u._id).length}</td>
                          <td>
                            {u.role !== 'admin' && (
                              <button 
                                className="btn btn-sm"
                                style={{ background: '#dc3545', color: 'white' }}
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="card fade-in">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 style={{ marginBottom: 0, color: 'var(--primary-blue)' }}>All Courses</h5>
                  <Link to="/admin/create-course" className="btn btn-sm btn-primary">+ Add Course</Link>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search courses by name or instructor..."
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Students</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((c) => (
                        <tr key={c._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={c.thumbnail || defaultImage}
                                alt=""
                                className="rounded"
                                style={{ width: '50px', height: '35px', objectFit: 'cover', marginRight: '0.75rem' }}
                              />
                              <span style={{ fontWeight: '500' }}>{c.title}</span>
                            </div>
                          </td>
                          <td>{c.instructor?.name || 'Unknown'}</td>
                          <td><span className="badge bg-secondary">{c.category}</span></td>
                          <td>${c.price}</td>
                          <td>{c.enrolledStudents?.length || 0}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link to={`/courses/${c._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                              <button className="btn btn-sm" style={{ background: '#dc3545', color: 'white' }} onClick={() => handleDeleteCourse(c._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === 'enrollments' && (
            <div className="card fade-in">
              <div className="card-body">
                <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Course Enrollments</h5>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Which student is enrolled in which course</p>
                
                {courses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {courses.map((course) => {
                      const courseEnrollments = getCourseEnrollments(course._id);
                      return (
                        <div key={course._id} style={{ 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '12px', 
                          padding: '1rem',
                          background: 'var(--bg-light)'
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <img 
                                src={course.thumbnail || defaultImage}
                                alt=""
                                className="rounded"
                                style={{ width: '60px', height: '40px', objectFit: 'cover', marginRight: '1rem' }}
                              />
                              <div>
                                <h6 style={{ marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>{course.title}</h6>
                                <small style={{ color: 'var(--text-muted)' }}>Instructor: {course.instructor?.name}</small>
                              </div>
                            </div>
                            <span className="badge" style={{ background: 'var(--primary-blue)', color: 'white' }}>
                              {courseEnrollments.length} Students
                            </span>
                          </div>
                          
                          {courseEnrollments.length > 0 ? (
                            <table className="table table-sm mb-0" style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                              <thead>
                                <tr>
                                  <th>Student</th>
                                  <th>Progress</th>
                                </tr>
                              </thead>
                              <tbody>
                                {courseEnrollments.map((enrollment) => (
                                  <tr key={enrollment._id}>
                                    <td>{enrollment.student?.name || 'Student'}</td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div style={{ flex: 1, height: '8px', background: 'var(--bg-light)', borderRadius: '4px', marginRight: '0.5rem' }}>
                                          <div style={{ 
                                            width: `${enrollment.progress || 0}%`, 
                                            height: '100%', 
                                            background: 'var(--accent-orange)',
                                            borderRadius: '4px'
                                          }}></div>
                                        </div>
                                        <small>{Math.round(enrollment.progress || 0)}%</small>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p style={{ color: 'var(--text-muted)', marginBottom: 0, textAlign: 'center', padding: '1rem' }}>No students enrolled yet</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted text-center py-4">No courses available</p>
                )}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="card fade-in">
              <div className="card-body">
                <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Contact Messages</h5>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Messages from students via contact form</p>
                
                {messages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                      <div 
                        key={msg._id} 
                        style={{ 
                          border: msg.isRead ? '1px solid var(--border-color)' : '2px solid var(--accent-orange)', 
                          borderRadius: '12px', 
                          padding: '1rem',
                          background: msg.isRead ? 'var(--bg-light)' : 'white'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                background: 'var(--primary-blue)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                marginRight: '0.75rem'
                              }}>
                              {msg.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 style={{ marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>{msg.name}</h6>
                              <small style={{ color: 'var(--text-muted)' }}>{msg.email}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <small style={{ color: 'var(--text-muted)' }}>
                              {new Date(msg.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                            <button 
                              className="btn btn-sm"
                              style={{ background: '#dc3545', color: 'white' }}
                              onClick={async () => {
                                if (window.confirm('Delete this message?')) {
                                  try {
                                    await contactService.deleteMessage(msg._id);
                                    setMessages(messages.filter(m => m._id !== msg._id));
                                  } catch (err) {
                                    alert('Failed to delete message');
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div style={{ 
                          background: 'var(--bg-light)', 
                          borderRadius: '8px', 
                          padding: '0.75rem',
                          marginTop: '0.5rem'
                        }}>
                          <p style={{ marginBottom: 0, color: '#333', lineHeight: '1.5' }}>{msg.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-4">No messages yet</p>
                )}
              </div>
            </div>
          )}

          {/* Instructor Requests Tab */}
          {activeTab === 'requests' && (
            <div className="card fade-in">
              <div className="card-body">
                <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Instructor Approval Requests</h5>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Review ID documents and approve or reject instructor registration requests</p>
                
                {pendingLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : pendingInstructors.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pendingInstructors.map((instructor) => (
                      <div 
                        key={instructor._id} 
                        style={{ 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '12px', 
                          padding: '1.5rem',
                          background: 'white'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center">
                            <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: '50%', 
                                background: 'var(--accent-orange)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                fontSize: '1.25rem',
                                marginRight: '1rem'
                              }}>
                              {instructor.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 style={{ marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>{instructor.name}</h6>
                              <p style={{ marginBottom: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{instructor.email}</p>
                              <p style={{ marginBottom: '0.25rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: '500' }}>
                                ID Number: {instructor.idNumber || 'Not provided'}
                              </p>
                              <p style={{ marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                Registered: {new Date(instructor.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm"
                              style={{ background: '#22c55e', color: 'white' }}
                              onClick={() => handleApproveInstructor(instructor._id)}
                            >
                              ✓ Approve
                            </button>
                            <button 
                              className="btn btn-sm"
                              style={{ background: '#dc3545', color: 'white' }}
                              onClick={() => handleRejectInstructor(instructor._id)}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h5 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>No Pending Requests</h5>
                    <p style={{ color: 'var(--text-muted)' }}>All instructor requests have been processed</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default AdminDashboard;
