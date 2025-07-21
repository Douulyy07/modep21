import React from 'react';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ModernHeader({ 
  darkMode, 
  setDarkMode, 
  onToggleSidebar, 
  sidebarCollapsed, 
  isMobile,
  onOpenProfile 
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-primary border-b border-light backdrop-blur-sm bg-opacity-95">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-tertiary rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Gestion Mutualiste
              </h1>
              <p className="text-sm text-secondary">
                Tableau de bord administratif
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:flex items-center space-x-2 bg-secondary px-4 py-2 rounded-xl">
              <Search className="w-4 h-4 text-tertiary" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none text-sm text-primary placeholder-tertiary w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-tertiary rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-secondary" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={setDarkMode}
              className="p-2 hover:bg-tertiary rounded-xl transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-secondary" />
              ) : (
                <Moon className="w-5 h-5 text-secondary" />
              )}
            </button>

            {/* User Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-3 p-2 hover:bg-tertiary rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-primary">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-secondary">
                  @{user?.username}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}