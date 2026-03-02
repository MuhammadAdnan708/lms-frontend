import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    idNumber: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(formData);
      setStep(2);
      setSuccessMessage('Verification code sent to your email!');
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    try {
      const code = verificationCode.join('');
      const { data } = await authService.verifyEmail({ 
        email: formData.email, 
        code: code
      });
      
      if (formData.role === 'instructor') {
        setSuccessMessage('Email verified! Your account is pending admin approval. You will be notified once approved.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        navigate('/login', { state: { message: 'Registration successful! Please login with your credentials.' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setVerifying(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendVerification({ email: formData.email });
      setResendTimer(60);
      setSuccessMessage('Verification code resent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div className="text-center mb-4">
                <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
                  {step === 1 ? 'Register Now' : 'Verify Email'}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                  {step === 1 ? 'Join Learnix and start learning' : `Enter the code sent to ${formData.email}`}
                </p>
              </div>
              
              {error && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#fee2e2', 
                  color: '#dc2626', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem'
                }}>
                  {error}
                </div>
              )}

              {successMessage && step === 2 && (
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
              
              {step === 1 ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
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
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Create a password"
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
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>
                      {formData.role === 'instructor' ? 'Instructor ID Number *' : 'Student ID Number'}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={formData.role === 'instructor' ? "Enter your instructor ID" : "Enter your student ID (optional)"}
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      required={formData.role === 'instructor'}
                    />
                    {formData.role === 'instructor' && (
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Your ID will be verified by admin before approval
                      </small>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>I want to:</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="student">Learn (Student)</option>
                      <option value="instructor">Teach (Instructor)</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-accent w-100" 
                    disabled={loading}
                    style={{ padding: '0.75rem', fontWeight: '600' }}
                  >
                    {loading ? 'Sending...' : 'Register Now'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify}>
                  <div className="mb-4">
                    <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500', display: 'block', textAlign: 'center', marginBottom: '1rem' }}>Verification Code</label>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          autoFocus={index === 0}
                          style={{
                            width: '45px',
                            height: '55px',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            background: 'white',
                            fontWeight: '600'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-accent w-100" 
                    disabled={verifying}
                    style={{ padding: '0.75rem', fontWeight: '600' }}
                  >
                    {verifying ? 'Verifying...' : 'Verify Email'}
                  </button>
                  
                  <div className="text-center mt-3">
                    {resendTimer > 0 ? (
                      <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                        Resend code in <strong>{resendTimer}s</strong>
                      </p>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleResend}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                  
                  <div className="text-center mt-3">
                    <button 
                      type="button"
                      onClick={() => { setStep(1); setError(''); setSuccessMessage(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      ← Back to registration
                    </button>
                  </div>
                </form>
              )}
              
              <div className="text-center mt-4">
                <p style={{ color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: 'var(--accent-orange)', fontWeight: '600' }}>
                    Sign In
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

export default Register;
