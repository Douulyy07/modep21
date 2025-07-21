import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { 
    path: '/dashboard', 
    icon: 'bi-speedometer2', 
    label: 'Dashboard',
    color: '#3b82f6'
  },
  { 
    path: '/adherents', 
    icon: 'bi-people', 
    label: 'Adhérents',
    color: '#10b981'
  },
  { 
    path: '/cotisations', 
    icon: 'bi-credit-card', 
    label: 'Cotisations',
    color: '#f59e0b'
  },
  { 
    path: '/soins', 
    icon: 'bi-heart-pulse', 
    label: 'Soins',
    color: '#ef4444'
  },
];

export default function ModernSidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 ${isCollapsed ? 'd-none' : ''}`}
        style={{ zIndex: 999 }}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed d-md-block' : ''} ${!isCollapsed ? 'show' : ''}`}>
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="p-4 border-bottom border-secondary">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  }}
                >
                  <i className="bi bi-heart-pulse text-white fs-5"></i>
                </div>
                <div>
                  <h5 className="text-white mb-0 fw-bold">MutuCare</h5>
                  <small className="text-white-50">Gestion Mutualiste</small>
                </div>
              </div>
              <button 
                className="btn btn-link text-white d-md-none p-0"
                onClick={onToggle}
              >
                <i className="bi bi-x fs-4"></i>
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                }}
              >
                <i className="bi bi-person text-white fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="text-white mb-0">{user?.first_name} {user?.last_name}</h6>
                <small className="text-white-50">@{user?.username}</small>
              </div>
              <div className="dropdown">
                <button 
                  className="btn btn-link text-white p-0"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                {showUserMenu && (
                  <div className="dropdown-menu dropdown-menu-end show">
                    <button className="dropdown-item">
                      <i className="bi bi-person me-2"></i>Profil
                    </button>
                    <button className="dropdown-item">
                      <i className="bi bi-gear me-2"></i>Paramètres
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow-1 p-3">
            <div className="d-flex flex-column gap-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`btn text-start d-flex align-items-center p-3 rounded-3 text-decoration-none transition-all ${
                      isActive
                        ? 'btn-primary shadow-sm'
                        : 'btn-link text-white-50 hover-bg-secondary'
                    }`}
                    style={{
                      backgroundColor: isActive ? item.color : 'transparent',
                      borderColor: isActive ? item.color : 'transparent'
                    }}
                    onClick={() => window.innerWidth < 768 && onToggle()}
                  >
                    <i className={`${item.icon} fs-5 me-3`}></i>
                    <span className="fw-medium">{item.label}</span>
                    {isActive && <i className="bi bi-chevron-right ms-auto"></i>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-top border-secondary">
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}