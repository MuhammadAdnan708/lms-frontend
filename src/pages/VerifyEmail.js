import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value !== '' && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await authService.verifyEmail({ email, code: verificationCode });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => {
        if (data.user.role === 'instructor') {
          navigate('/instructor/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authService.resendVerification({ email });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              {success ? (
                <div className="text-center">
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#28a745', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Account Created Successfully!</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Redirecting to dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Verify Your Email</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                      We've sent a 6-digit code to<br />
                      <strong style={{ color: 'var(--primary-blue)' }}>{email}</strong>
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

                  <form onSubmit={handleVerify}>
                    <div className="d-flex justify-content-center gap-2 mb-4">
                      {code.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
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
                      {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    {resendTimer > 0 ? (
                      <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                        Resend code in <strong>{resendTimer}s</strong>
                      </p>
                    ) : (
                      <button 
                        onClick={handleResend}
                        disabled={resendLoading}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--accent-orange)', 
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {resendLoading ? 'Sending...' : 'Resend Code'}
                      </button>
                    )}
                  </div>

                  <div className="text-center mt-3">
                    <Link to="/register" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Use different email
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

export default VerifyEmail;
