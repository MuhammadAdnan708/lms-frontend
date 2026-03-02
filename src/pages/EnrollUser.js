import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, courseService, enrollmentService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const EnrollUser = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        userService.getAll(),
        courseService.getAll()
      ]);
      setStudents(usersRes.data.filter(u => u.role === 'student'));
      setCourses((coursesRes.data.courses || coursesRes.data).filter(c => c.isPublished));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) {
      setMessage({ type: 'danger', text: 'Please select both student and course' });
      return;
    }

    setEnrolling(true);
    setMessage({ type: '', text: '' });

    try {
      await enrollmentService.enroll(selectedCourse);
      setMessage({ type: 'success', text: 'Student enrolled successfully!' });
      setSelectedStudent('');
      setSelectedCourse('');
      setTimeout(() => {
        navigate('/admin/dashboard?tab=enrollments');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to enroll student';
      setMessage({ type: 'danger', text: errorMsg });
    } finally {
      setEnrolling(false);
    }
  };

  const getStudentEnrolledCourses = (studentId) => {
    return courses.filter(c => c.enrolledStudents?.includes(studentId)).length;
  };

  const Content = () => (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>Enroll User</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Enroll a student in a course</p>
        </div>
        <button 
          className="btn btn-outline-primary"
          onClick={() => navigate('/admin/dashboard?tab=enrollments')}
        >
          View Enrollments
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <form onSubmit={handleEnroll}>
            <div className="mb-3">
              <label className="form-label">Select Student</label>
              <select
                className="form-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email}) - {getStudentEnrolledCourses(student._id)} courses
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Select Course</label>
              <select
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} - ${course.price}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-accent w-100"
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <h5 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Quick Enroll from List</h5>
        <div className="row g-3">
          {courses.slice(0, 3).map((course) => (
            <div key={course._id} className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{course.title}</h6>
                  <p className="text-muted small mb-2">{course.instructor?.name}</p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setSelectedCourse(course._id);
                      document.querySelector('select:nth-of-type(1)').focus();
                    }}
                  >
                    Select This Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Content />
      )}
    </DashboardLayout>
  );
};

export default EnrollUser;
