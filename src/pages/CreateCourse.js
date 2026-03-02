import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    thumbnail: ''
  });
  const [lessons, setLessons] = useState([]);
  const [lessonData, setLessonData] = useState({ title: '', content: '', duration: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { 
        ...formData,
        price: parseFloat(formData.price) || 0,
        lessons,
        thumbnail: formData.thumbnail || ''
      };
      await courseService.create(payload);
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/instructor/dashboard');
    } catch (error) {
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const addLesson = () => {
    if (lessonData.title.trim()) {
      setLessons([...lessons, { 
        title: lessonData.title, 
        content: lessonData.content, 
        duration: parseInt(lessonData.duration) || 0 
      }]);
      setLessonData({ title: '', content: '', duration: '' });
    }
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Science'];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>Create New Course</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Add a new course to your catalog</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: '2rem' }}>
            <form key={formKey} onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Course Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g., Complete Python Course"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '8px', padding: '12px' }}
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Description *</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Describe your course..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '8px', padding: '12px' }}
                />
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', padding: '12px' }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Price ($) *</label>
                  <input
                    type="text"
                    name="price"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  style={{ borderRadius: '8px', padding: '12px' }}
                />
                {formData.thumbnail && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Preview:</p>
                    <img 
                      src={formData.thumbnail} 
                      alt="Thumbnail preview" 
                      style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        alert('Invalid image URL! Please enter a valid image URL.');
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="card mb-4" style={{ background: 'var(--bg-light)', border: 'none' }}>
                <div className="card-header bg-transparent">
                  <h5 style={{ color: 'var(--primary-blue)', marginBottom: 0 }}>Add Lessons ({lessons.length})</h5>
                </div>
                <div className="card-body">
                  {lessons.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      {lessons.map((lesson, index) => (
                        <div 
                          key={index}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            background: 'white',
                            borderRadius: '8px',
                            marginBottom: '0.5rem'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: '500', color: 'var(--primary-blue)' }}>{index + 1}. {lesson.title}</span>
                            {lesson.duration && <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({lesson.duration} min)</span>}
                          </div>
                          <button 
                            type="button"
                            className="btn btn-sm"
                            style={{ background: '#dc3545', color: 'white' }}
                            onClick={() => removeLesson(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-md-5">
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Lesson Title"
                        value={lessonData.title}
                        onChange={handleLessonChange}
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        name="content"
                        className="form-control"
                        placeholder="Content description"
                        value={lessonData.content}
                        onChange={handleLessonChange}
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        name="duration"
                        className="form-control"
                        placeholder="Min"
                        value={lessonData.duration}
                        onChange={handleLessonChange}
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </div>
                    <div className="col-md-1">
                      <button 
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={addLesson}
                        style={{ borderRadius: '8px', padding: '12px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-accent" disabled={loading} style={{ fontWeight: '600' }}>
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
                <button 
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;
