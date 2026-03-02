import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseService } from '../services/api';

const Courses = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data } = await courseService.getAll();
        const coursesData = data.courses || data;
        const uniqueCourses = coursesData ? [...new Map(coursesData.map(item => [item._id, item])).values()] : [];
        setCourses(uniqueCourses);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Science'];
  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop";

  const filteredCourses = courses.filter(c => {
    const matchCategory = !category || c.category === category;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Page Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', 
        padding: '60px 0' 
      }}>
        <div className="container">
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '2.5rem', marginBottom: '8px' }}>All Courses</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0, fontSize: '1.1rem' }}>
            Explore our comprehensive course catalog
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        {/* Search and Filter */}
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '32px'
        }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '10px' }}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '10px' }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn w-100"
                onClick={() => { setSearch(''); setCategory(''); }}
                style={{ 
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 600
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '1rem' }}>
          <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'} found
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div className="col-md-6 col-lg-4" key={course._id}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={course.thumbnail || defaultImage} 
                      alt={course.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = defaultImage; }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                      color: '#0f172a',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {course.category}
                    </div>
                  </div>
                  
                  <div style={{ padding: '20px' }}>
                    <h5 style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                      {course.title}
                    </h5>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.5 }}>
                      {course.description?.substring(0, 80)}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        marginRight: '10px'
                      }}>
                        {course.instructor?.name?.charAt(0) || 'I'}
                      </div>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        {course.instructor?.name || 'Instructor'}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                        ${course.price}
                      </span>
                      <Link 
                        to={`/courses/${course._id}`}
                        style={{
                          background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                          color: '#0f172a',
                          padding: '10px 24px',
                          borderRadius: '25px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>No courses found</h4>
            <p style={{ color: '#64748b' }}>Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => { setSearch(''); setCategory(''); }}
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                color: '#0f172a',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '25px',
                fontWeight: 600,
                marginTop: '16px',
                cursor: 'pointer'
              }}
            >
              View All Courses
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: '#0a1628', padding: '40px 0', color: 'white' }}>
        <div className="container">
          <div className="text-center">
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>© 2024 Learnix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
