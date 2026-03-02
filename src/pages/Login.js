import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setPendingApproval(false);
    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(err.response.data.email);
        setError(err.response.data.message);
      } else if (err.response?.data?.pendingApproval) {
        setPendingApproval(true);
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div className="text-center mb-4">
                <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Sign in to continue learning</p>
              </div>
              
              {successMessage && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#d1fae5', 
                  color: '#065f46', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem'
                }}>
                  {successMessage}
                </div>
              )}

              {error && (
                <div style={{ 
                  padding: '1rem', 
                  background: needsVerification ? '#fff3cd' : pendingApproval ? '#fee2e2' : '#fee2e2', 
                  color: needsVerification ? '#856404' : pendingApproval ? '#dc2626' : '#dc2626', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem'
                }}>
                  {error}
                  {needsVerification && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <Link 
                        to={`/verify-email?email=${encodeURIComponent(verificationEmail)}`}
                        style={{ color: 'var(--accent-orange)', fontWeight: '600' }}
                      >
                        Click here to verify →
                      </Link>
                    </div>
                  )}
                  {pendingApproval && (
                    <div style={{ marginTop: '0.5rem', color: '#856404' }}>
                      Please wait for admin to approve your account or contact support.
                    </div>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-accent w-100" 
                  disabled={loading}
                  style={{ padding: '0.75rem', fontWeight: '600' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <Link to="/forgot-password" style={{ color: 'var(--accent-orange)', fontWeight: '600', fontSize: '0.9rem' }}>
                  Forgot Password?
                </Link>
              </div>

              <div className="text-center mt-3">
                <p style={{ color: 'var(--text-muted)' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: 'var(--accent-orange)', fontWeight: '600' }}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
