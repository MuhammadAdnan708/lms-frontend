import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-public sticky-top" style={{ background: '#0f172a', border: 'none', boxShadow: 'none', marginBottom: 0 }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span>LEARN</span>IX
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ border: 'none', padding: '0.5rem' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
          
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <Link 
                to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'}
                className="btn btn-accent"
              >
                Dashboard
              </Link>
              <div className="dropdown">
                <button 
                  className="btn text-white dropdown-toggle" 
                  onClick={() => setShowDropdown(!showDropdown)}
                  type="button"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  {user.name}
                </button>
                {showDropdown && (
                  <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, display: 'block', marginTop: '0.5rem', minWidth: '180px' }}>
                    {user.role === 'student' && (
                      <>
                        <Link className="dropdown-item" to="/student/dashboard" onClick={() => setShowDropdown(false)}>
                          My Dashboard
                        </Link>
                        <Link className="dropdown-item" to="/student/profile" onClick={() => setShowDropdown(false)}>
                          My Profile
                        </Link>
                      </>
                    )}
                    {user.role === 'instructor' && (
                      <>
                        <Link className="dropdown-item" to="/instructor/dashboard" onClick={() => setShowDropdown(false)}>
                          My Dashboard
                        </Link>
                        <Link className="dropdown-item" to="/instructor/create-course" onClick={() => setShowDropdown(false)}>
                          Create Course
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <>
                        <Link className="dropdown-item" to="/admin/dashboard" onClick={() => setShowDropdown(false)}>
                          Admin Dashboard
                        </Link>
                        <Link className="dropdown-item" to="/admin/create-course" onClick={() => setShowDropdown(false)}>
                          Create Course
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="d-flex gap-3 align-items-center">
              <Link className="nav-link text-white" to="/login">Sign In</Link>
              <Link className="btn btn-accent" to="/register">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
