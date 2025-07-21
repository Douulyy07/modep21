import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute';
import ModernAppLayout from './components/Layout/ModernAppLayout';
import './styles/globals.css';

// Auth pages
import Login from './pages/login';
import Signup from './pages/signup';

// Protected pages
import Dashboard from './pages/Dashboard';
import Adherents from './pages/Adherents';
import Cotisations from './pages/Cotisations';
import Soins from './pages/Soins';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <ModernAppLayout>
                <Dashboard />
              </ModernAppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/adherents" element={
            <PrivateRoute>
              <ModernAppLayout>
                <Adherents />
              </ModernAppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/cotisations" element={
            <PrivateRoute>
              <ModernAppLayout>
                <Cotisations />
              </ModernAppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/soins" element={
            <PrivateRoute>
              <ModernAppLayout>
                <Soins />
              </ModernAppLayout>
            </PrivateRoute>
          } />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;