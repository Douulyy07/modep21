import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Heart, 
  User,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Tableau de bord'
  },
  { 
    path: '/adherents', 
    icon: Users, 
    label: 'Adhésions'
  },
  { 
    path: '/cotisations', 
    icon: CreditCard, 
    label: 'Cotisations'
  },
  { 
    path: '/soins', 
    icon: Heart, 
    label: 'Soins ambulatoires'
  }
];

export default function ModernSidebar({ isCollapsed, isOpen, isMobile, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const sidebarClasses = `
    sidebar 
    ${isCollapsed && !isMobile ? 'collapsed' : ''} 
    ${isMobile && isOpen ? 'open' : ''}
  `;

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          MC
        </div>
        <div className="sidebar-title">
          <div className="text-lg font-bold">MutuCare</div>
          <div className="text-xs text-secondary">MODEP</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed && !isMobile ? item.label : ''}
            >
              <Icon className="nav-item-icon" />
              <span className="nav-item-text">{item.label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-light"></div>

        {/* Profile & Settings */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openProfile'))}
          className="nav-item"
          title={isCollapsed && !isMobile ? 'Profil employé' : ''}
        >
          <User className="nav-item-icon" />
          <span className="nav-item-text">Profil employé</span>
        </button>

        <button
          className="nav-item"
          title={isCollapsed && !isMobile ? 'Paramètres' : ''}
        >
          <Settings className="nav-item-icon" />
          <span className="nav-item-text">Paramètres</span>
        </button>

        <button
          onClick={handleLogout}
          className="nav-item text-error hover:bg-error hover:bg-opacity-10"
          title={isCollapsed && !isMobile ? 'Déconnexion' : ''}
        >
          <LogOut className="nav-item-icon" />
          <span className="nav-item-text">Déconnexion</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="user-role">
              Administrateur
            </div>
          </div>
        </div>
        
        {(!isCollapsed || isMobile) && (
          <button className="btn btn-ghost btn-sm w-full mt-3">
            <HelpCircle className="w-4 h-4" />
            <span>Besoin d'aide ?</span>
          </button>
        )}
      </div>
    </div>
  );
}