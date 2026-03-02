import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    thumbnail: ''
  });
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', duration: 0 });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await courseService.getOne(id);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          price: data.price || 0,
          thumbnail: data.thumbnail || ''
        });
        setLessons(data.lessons || []);
      } catch (error) {
        alert('Failed to load course');
        navigate('/instructor/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await courseService.update(id, { ...formData, lessons });
      alert('Course updated successfully!');
      navigate('/instructor/dashboard');
    } catch (error) {
      alert('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const addLesson = () => {
    if (newLesson.title) {
      setLessons([...lessons, newLesson]);
      setNewLesson({ title: '', content: '', duration: 0 });
    }
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Science'];

  const PageContent = () => {
    if (initialLoading) {
      return (
        <div className="page-container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>Edit Course</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Update your course details</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Course Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
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
                    type="number"
                    className="form-control"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Thumbnail URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
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
                  <h5 style={{ color: 'var(--primary-blue)', marginBottom: 0 }}>Lessons ({lessons.length})</h5>
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
                        className="form-control"
                        placeholder="Lesson Title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Content description"
                        value={newLesson.content}
                        onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="col-md-1">
                      <button 
                        type="button" 
                        className="btn btn-primary w-100"
                        onClick={addLesson}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-accent" disabled={loading} style={{ fontWeight: '600' }}>
                  {loading ? 'Saving...' : 'Save Changes'}
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
    );
  };

  return (
    <DashboardLayout>
      <PageContent />
    </DashboardLayout>
  );
};

export default EditCourse;
