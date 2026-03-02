import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleNameSave = async () => {
    if (!name.trim()) {
      setMessage('Please enter a name');
      setMessageType('error');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const { data } = await authService.updateProfile({ name });
      updateUser(data);
      setMessage('Name updated successfully!');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update name');
      setMessageType('error');
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setMessage('Please fill both password fields');
      setMessageType('error');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await authService.updateProfile({ password: newPassword });
      setMessage('Password changed successfully!');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password');
      setMessageType('error');
    }
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem', maxWidth: '550px', margin: '0 auto' }}>
        <h2 style={{ color: '#162d59', marginBottom: '0.25rem' }}>My Profile</h2>
        <p style={{ color: '#6c757d', marginBottom: '2rem' }}>Manage your account settings</p>

        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            background: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        {/* Profile Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: '#162d59',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: '600'
            }}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ marginLeft: '1rem' }}>
              <h5 style={{ color: '#162d59', margin: 0 }}>{name}</h5>
              <span style={{ 
                background: '#ff7f40', 
                color: 'white', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
              }}>
                {user.role}
              </span>
            </div>
          </div>

          <h6 style={{ color: '#162d59', marginBottom: '1rem' }}>Change Name</h6>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.6rem 1rem', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button 
              onClick={handleNameSave}
              disabled={saving}
              style={{ 
                padding: '0.6rem 1.5rem', 
                background: '#ff7f40', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {saving ? 'Saving...' : 'Save Name'}
            </button>
          </div>
          
          <div style={{ marginTop: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>
            Email: {user.email} (cannot be changed)
          </div>
        </div>

        {/* Password Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h6 style={{ color: '#162d59', marginBottom: '1rem' }}>Change Password</h6>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem 1rem', 
                border: '1px solid #dee2e6', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem 1rem', 
                border: '1px solid #dee2e6', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button 
            onClick={handlePasswordChange}
            disabled={saving}
            style={{ 
              padding: '0.6rem 1.5rem', 
              background: '#162d59', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
