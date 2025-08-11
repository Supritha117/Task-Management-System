import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Notification } from '@progress/kendo-react-notification';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- added state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axiosClient.post('/Auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.userName);
      if (data.role === 'Employee') navigate('/employee');
      else if (data.role === 'Manager') navigate('/manager');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#e3f2fd', // soft blue background
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          marginTop: '60px',
          width: '100%',
          maxWidth: 400,
          padding: '0 16px',
        }}
      >
        <Card
          style={{
            width: '100%',
            padding: '20px',
            margin: 'auto',
            boxShadow: '0 4px 24px rgba(33, 150, 243, 0.08)',
            borderRadius: '16px',
          }}
        >
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              <div style={{ width: '100%' }}>
                <Input
                  label="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  style={{ fontSize: '1rem', width: '100%' }}
                />
              </div>
              <div style={{ width: '100%', position: 'relative' }}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ fontSize: '1rem', width: '100%', paddingRight: '40px',  }}
                />
                <span
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 1px 4px rgba(33,150,243,0.08)',
                    height: '28px',
                    width: '28px',
                    justifyContent: 'center',
                    marginTop: '8px'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(s => !s); }}
                >
                  {showPassword ? (
                    // Eye open SVG
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="#1976d2"/>
                    </svg>
                  ) : (
                    // Eye closed SVG
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5c-5 0-9.27 3.11-11 7a11.94 11.94 0 0 0 3.06 4.36l-1.42 1.42a1 1 0 0 0 1.41 1.41l18-18a1 1 0 0 0-1.41-1.41l-2.1 2.1A11.94 11.94 0 0 0 12 5zm0 14c5 0 9.27-3.11 11-7a11.94 11.94 0 0 0-3.06-4.36l1.42-1.42a1 1 0 0 0-1.41-1.41l-18 18a1 1 0 0 0 1.41 1.41l2.1-2.1A11.94 11.94 0 0 0 12 19zm0-2a5 5 0 0 1-5-5c0-.83.21-1.61.57-2.29l6.72 6.72A4.98 4.98 0 0 1 12 17zm0-10a5 5 0 0 1 5 5c0 .83-.21 1.61-.57 2.29l-6.72-6.72A4.98 4.98 0 0 1 12 7z" fill="#1976d2"/>
                    </svg>
                  )}
                </span>
              </div>
              {error && (
                <Notification
                  type={{ style: 'error', icon: true }}
                  closable={true}
                  onClose={() => setError('')}
                  style={{ fontSize: '0.95rem' }}
                >
                  <span>{error}</span>
                </Notification>
              )}
              <Button
                themeColor="primary"
                type="submit"
                style={{
                  background: '#1976d2', // matching blue
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '10px 0',
                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.12)',
                  border: 'none',
                  transition: 'background 0.2s',
                }}
              >
                Login
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 600px) {
            div[style*="marginTop"] {
              margin-top: 20px !important;
              max-width: 100vw !important;
              padding: 0 8px !important;
            }
            .k-card {
              padding: 10px !important;
              border-radius: 8px !important;
            }
            form {
              gap: 10px !important;
            }
          }
          @media (min-width: 601px) and (max-width: 900px) {
            div[style*="marginTop"] {
              margin-top: 40px !important;
              max-width: 90vw !important;
              padding: 0 12px !important;
            }
            .k-card {
              padding: 16px !important;
              border-radius: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
