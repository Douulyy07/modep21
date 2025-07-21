import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

export default function CollapsibleSidebar({ isCollapsed, onToggle, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 999 }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${isCollapsed && !isMobile ? 'sidebar-collapsed' : ''} ${!isCollapsed || !isMobile ? 'show' : ''}`}
        initial={false}
        animate={{ 
          width: isCollapsed && !isMobile ? '80px' : '280px',
          transform: isMobile && isCollapsed ? 'translateX(-100%)' : 'translateX(0)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ zIndex: 1000 }}
      >
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="p-3 border-bottom border-secondary">
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
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h5 className="text-white mb-0 fw-bold">MutuCare</h5>
                      <small className="text-white-50">Gestion Mutualiste</small>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isMobile && (
                <button 
                  className="btn btn-link text-white p-0"
                  onClick={onToggle}
                >
                  <i className="bi bi-x fs-4"></i>
                </button>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                }}
              >
                <i className="bi bi-person text-white fs-5"></i>
              </div>
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-grow-1 min-width-0"
                  >
                    <h6 className="text-white mb-0 text-truncate">{user?.first_name} {user?.last_name}</h6>
                    <small className="text-white-50 text-truncate d-block">@{user?.username}</small>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="dropdown">
                <button 
                  className="btn btn-link text-white p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      className="dropdown-menu dropdown-menu-end show position-absolute"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{ top: '100%', right: 0 }}
                    >
                      <button className="dropdown-item" onClick={() => window.dispatchEvent(new CustomEvent('openProfile'))}>
                        <i className="bi bi-person me-2"></i>Profil
                      </button>
                      <button className="dropdown-item">
                        <i className="bi bi-gear me-2"></i>Paramètres
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow-1 p-2">
            <div className="d-flex flex-column gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    className={`btn text-start d-flex align-items-center p-3 rounded-3 border-0 position-relative ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'btn-link text-white-50 hover-bg-secondary'
                    }`}
                    style={{
                      backgroundColor: isActive ? item.color : 'transparent',
                      justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start'
                    }}
                    onClick={() => handleMenuClick(item.path)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={isCollapsed && !isMobile ? item.label : ''}
                  >
                    <i className={`${item.icon} fs-5 ${isCollapsed && !isMobile ? '' : 'me-3'}`}></i>
                    <AnimatePresence>
                      {(!isCollapsed || isMobile) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="fw-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (!isCollapsed || isMobile) && (
                      <i className="bi bi-chevron-right ms-auto"></i>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </nav>

        </div>
      </motion.div>
    </>
  );
}