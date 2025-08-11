import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

const getRole = () => localStorage.getItem('role');

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const role = getRole();
  if (!token || !roles.includes(role)) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Employee Dashboard */}
        <Route
          path="/employee"
          element={
            <PrivateRoute roles={['Employee']}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        {/* Manager Dashboard */}
        <Route
          path="/manager"
          element={
            <PrivateRoute roles={['Manager']}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
