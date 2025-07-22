import React from 'react';
import { Menu, Sun, Moon, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ModernHeader({ 
  darkMode, 
  onToggleTheme, 
  onToggleSidebar, 
  sidebarCollapsed, 
  isMobile,
  onOpenProfile 
}) {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle"
          title={isMobile ? 'Ouvrir le menu' : (sidebarCollapsed ? 'Développer la sidebar' : 'Réduire la sidebar')}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h1 className="header-title">Gestion Mutualiste</h1>
          <p className="header-subtitle">Tableau de bord administratif MODEP</p>
        </div>
      </div>

      <div className="header-right">
        {/* Search - Hidden on mobile */}
        <div className="search-container hidden md:block">
          <Search className="search-icon w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <button className="theme-toggle notification-badge" title="Notifications">
          <Bell className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* User Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-tertiary transition-colors"
          title="Profil utilisateur"
        >
          <div className="user-avatar w-8 h-8 text-sm">
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-primary">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-xs text-secondary">
              @{user?.username}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}