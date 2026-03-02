import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await contactService.sendMessage(formData);
      setMessage(response.data.message || 'Thank you for your feedback!');
      setFormData({ ...formData, description: '' });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage('Please login to send message');
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to send message. Please try again.');
      }
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center align-items-center">

          {/* Left Side */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div style={{ paddingRight: '2rem' }}>
              <h6 style={{ color: '#22d3ee', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Get In Touch
              </h6>
              <h1 style={{ color: 'white', fontWeight: '700', fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>
                Have Questions? <br />
                <span style={{ color: '#22d3ee' }}>We'd Love to Hear</span> From You!
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                At Learnix, we're dedicated to providing the best online learning experience.
                Whether you have questions about our courses, need support, or want to share
                your feedback, we're here to help.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '2px', textTransform: 'uppercase' }}>Email</p>
                    <a href="mailto:m.adnan22708@gmail.com" style={{ color: 'white', fontWeight: '500', marginBottom: 0, textDecoration: 'none' }}>m.adnan22708@gmail.com</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '2px', textTransform: 'uppercase' }}>Location</p>
                    <p style={{ color: 'white', fontWeight: '500', marginBottom: 0 }}>Lahore, Pakistan</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '2px', textTransform: 'uppercase' }}>Phone</p>
                    <p style={{ color: 'white', fontWeight: '500', marginBottom: 0 }}>+92 323 6341084</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-5">
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              padding: '40px'
            }}>
              <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px' }}>Send us a Message</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Fill out the form below and we'll get back to you soon.</p>

              {message && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  background: isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                  color: isError ? '#fca5a5' : '#86efac',
                  border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
                }}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Message</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="4"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                    color: '#0f172a',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
