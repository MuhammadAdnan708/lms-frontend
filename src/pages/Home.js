import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseService.getAll();
        const coursesData = data.courses || data;
        const uniqueCourses = coursesData ? [...new Map(coursesData.map(item => [item._id, item])).values()] : [];
        setCourses(uniqueCourses.slice(0, 6));
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop";

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
        }}></div>

        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                marginBottom: '1.5rem'
              }}>
                Transform Your <span style={{ color: '#22d3ee' }}>Future</span> With Online Learning
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.1rem',
                marginBottom: '2rem',
                lineHeight: 1.7
              }}>
                Access world-class courses from expert instructors.
                Build skills at your own pace and advance your career.
              </p>

              <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  background: 'white',
                  borderRadius: '50px',
                  padding: '6px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}>
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      outline: 'none',
                      borderRadius: '50px 0 0 50px'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                      border: 'none',
                      color: '#0f172a',
                      padding: '12px 32px',
                      borderRadius: '50px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>

              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <span>Popular: </span>
                {['Python', 'Web Dev', 'Design', 'Marketing'].map((tag) => (
                  <span
                    key={tag}
                    onClick={() => navigate(`/courses?search=${tag}`)}
                    style={{
                      color: '#22d3ee',
                      cursor: 'pointer',
                      marginLeft: '12px',
                      textDecoration: 'underline'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                  alt="Learning"
                  style={{
                    borderRadius: '24px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    width: '100%',
                    maxWidth: '500px'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    background: '#22d3ee',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>50K+</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'white', padding: '30px 0', boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}>
        <div className="container">
          <div className="row text-center">
            {[
              { value: '500+', label: 'Courses' },
              { value: '50K+', label: 'Students' },
              { value: '200+', label: 'Instructors' },
              { value: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stat.value}</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '1rem'
            }}>
              Popular Courses
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Discover our most sought-after courses chosen by thousands of students
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="row g-4">
              {courses.map((course) => (
                <div className="col-md-6 col-lg-4" key={course._id}>
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
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
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={course.thumbnail || defaultImage}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
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

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h5 style={{
                        color: '#0f172a',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        marginBottom: '8px',
                        lineHeight: 1.4
                      }}>
                        {course.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.9rem',
                        marginBottom: '12px',
                        flex: 1
                      }}>
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
                        <span style={{
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: '#0f172a'
                        }}>
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
              <div style={{
                width: '80px',
                height: '80px',
                background: '#f1f5f9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>No Courses Available</h4>
              <p style={{ color: '#64748b' }}>Check back soon for new courses!</p>
            </div>
          )}

          {courses.length > 0 && (
            <div className="text-center mt-5">
              <Link
                to="/courses"
                style={{
                  display: 'inline-block',
                  background: 'white',
                  color: '#0f172a',
                  padding: '14px 36px',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  border: '2px solid #0f172a',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0f172a';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#0f172a';
                }}
              >
                View All Courses
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div className="row">
            {[
              { icon: '🎓', title: 'Expert Instructors', desc: 'Learn from industry professionals with years of experience' },
              { icon: '⏰', title: 'Flexible Learning', desc: 'Study at your own pace, anywhere and anytime' },
              { icon: '📜', title: 'Certificates', desc: 'Earn certificates upon completion of your courses' },
              { icon: '💬', title: '24/7 Support', desc: 'Get help whenever you need it with our support team' }
            ].map((feature, i) => (
              <div className="col-md-6 col-lg-3 mb-4" key={i}>
                <div style={{
                  textAlign: 'center',
                  padding: '30px 20px',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  height: '100%'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{feature.icon}</div>
                  <h5 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>{feature.title}</h5>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Start Learning?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '32px' }}>
            Join thousands of students already learning on Learnix
          </p>
          <Link
            to="/register"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              color: '#0f172a',
              padding: '16px 48px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(34, 211, 238, 0.3)'
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ padding: '60px 0 30px' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h4 style={{ fontWeight: 800, marginBottom: '16px' }}>
                <span style={{ color: '#22d3ee' }}>Learn</span>ix
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Your trusted online learning platform. Start building your skills today!
              </p>
            </div>
            <div className="col-lg-2 col-md-4 mb-4">
              <h6 style={{ fontWeight: 700, marginBottom: '16px' }}>Quick Links</h6>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Courses', 'About', 'Contact'].map(link => (
                  <li key={link} className="mb-2">
                    <Link to={`/${link.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-2 col-md-4 mb-4">
              <h6 style={{ fontWeight: 700, marginBottom: '16px' }}>Support</h6>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Help Center', 'Privacy Policy', 'Terms'].map(link => (
                  <li key={link} className="mb-2">
                    <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-4 col-md-4 mb-4">
              <h6 style={{ fontWeight: 700, marginBottom: '16px' }}>Contact Us</h6>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>m.adnan22708@gmail.com</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Lahore, Pakistan</p>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>+92 323 6341084</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>© 2026 Learnix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
