import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Heart, 
  Menu, 
  X, 
  LogOut, 
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Tableau de bord',
    color: 'text-accent'
  },
  { 
    path: '/adherents', 
    icon: Users, 
    label: 'Adhérents',
    color: 'text-success'
  },
  { 
    path: '/cotisations', 
    icon: CreditCard, 
    label: 'Cotisations',
    color: 'text-warning'
  },
  { 
    path: '/soins', 
    icon: Heart, 
    label: 'Soins',
    color: 'text-error'
  },
];

export default function ModernSidebar({ isCollapsed, onToggle, isMobile }) {
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
    if (isMobile && !isCollapsed) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed && !isMobile ? '80px' : '280px',
          x: isMobile && isCollapsed ? '-100%' : '0%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full bg-primary border-r border-light z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-xl font-bold text-primary">MutuCare</h1>
                    <p className="text-sm text-secondary">Gestion Mutualiste</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Toggle button for desktop */}
            {!isMobile && (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-tertiary rounded-lg transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-secondary" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-secondary" />
                )}
              </button>
            )}
            
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-tertiary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-light">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-success rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-primary truncate">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-secondary truncate">
                    @{user?.username}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {(!isCollapsed || isMobile) && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 hover:bg-tertiary rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-secondary" />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-primary border border-light rounded-xl shadow-lg py-2 z-10"
                    >
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('openProfile'))}
                        className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-tertiary transition-colors flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-error hover:bg-tertiary transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-md'
                    : 'text-secondary hover:bg-tertiary hover:text-primary'
                }`}
                title={isCollapsed && !isMobile ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : item.color}`} />
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-light">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-error hover:bg-tertiary rounded-xl transition-colors"
            title={isCollapsed && !isMobile ? 'Déconnexion' : ''}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium"
                >
                  Déconnexion
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </>
  );
}