import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (resendTimer > 0 && step === 2) {
      const timer = setInterval(() => setResendTimer(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, step]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);
    if (element.value !== '' && index < 5) {
      document.getElementById(`reset-code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`reset-code-${index - 1}`).focus();
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword({ email });
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const resetCode = code.join('');
    
    if (resetCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.verifyResetCode({ email, code: resetCode });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword({ 
        email, 
        code: code.join(''), 
        newPassword 
      });
      setSuccessMessage('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.forgotPassword({ email });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              {successMessage ? (
                <div className="text-center">
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#28a745', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Success!</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{successMessage}</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
                      {step === 1 && 'Reset Password'}
                      {step === 2 && 'Enter Code'}
                      {step === 3 && 'New Password'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                      {step === 1 && 'Enter your email to receive a reset code'}
                      {step === 2 && `We've sent a code to ${email}`}
                      {step === 3 && 'Create a new password for your account'}
                    </p>
                  </div>

                  {error && (
                    <div style={{ 
                      padding: '1rem', 
                      background: '#fee2e2', 
                      color: '#dc2626', 
                      borderRadius: '8px', 
                      marginBottom: '1.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'center'
                    }}>
                      {error}
                    </div>
                  )}

                  {step === 1 && (
                    <form onSubmit={handleSendCode}>
                      <div className="mb-4">
                        <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-accent w-100" 
                        disabled={loading}
                        style={{ padding: '0.75rem', fontWeight: '600' }}
                      >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                      <div className="d-flex justify-content-center gap-2 mb-4">
                        {code.map((digit, index) => (
                          <input
                            key={index}
                            id={`reset-code-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
                            style={{
                              width: '50px',
                              height: '55px',
                              textAlign: 'center',
                              fontSize: '24px',
                              fontWeight: '600',
                              borderRadius: '10px',
                              border: '2px solid var(--border-color)',
                              outline: 'none'
                            }}
                          />
                        ))}
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-accent w-100" 
                        disabled={loading}
                        style={{ padding: '0.75rem', fontWeight: '600' }}
                      >
                        {loading ? 'Verifying...' : 'Verify Code'}
                      </button>

                      <div className="text-center mt-4">
                        {resendTimer > 0 ? (
                          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                            Resend code in <strong>{resendTimer}s</strong>
                          </p>
                        ) : (
                          <button 
                            onClick={handleResend}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--accent-orange)', 
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                      <div className="mb-4">
                        <label className="form-label" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Confirm Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-accent w-100" 
                        disabled={loading}
                        style={{ padding: '0.75rem', fontWeight: '600' }}
                      >
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </form>
                  )}

                  <div className="text-center mt-4">
                    <Link to="/login" style={{ color: 'var(--accent-orange)', fontWeight: '600' }}>
                      Back to Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
