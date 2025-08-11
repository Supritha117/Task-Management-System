import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        padding: 10,
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 20 }}>Task Management</div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            backgroundColor: 'white',
            color: '#007bff',
            border: 'none',
            borderRadius: 20,
            padding: '5px 14px 5px 8px',
            fontWeight: 500,
            cursor: 'pointer',
            minWidth: 90,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {/* User Icon */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#007bff22',
            color: '#007bff',
            fontSize: 18
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="7" r="4"/>
              <path d="M2 17c0-3.31 3.13-6 7-6s7 2.69 7 6"/>
            </svg>
          </span>
          <span style={{ fontWeight: 500, color: '#007bff' }}>{userName}</span>
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              background: 'white',
              color: '#333',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              minWidth: 180,
              zIndex: 100,
              padding: '8px 0'
            }}
          >
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontWeight: 500 }}>{userName}</div>
              <div style={{ fontSize: 13, color: '#007bff' }}>{role}</div>
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#007bff',
                padding: '10px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
