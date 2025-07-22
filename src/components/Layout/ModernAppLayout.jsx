import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ModernSidebar from './ModernSidebar';
import ModernHeader from './ModernHeader';
import UserProfile from '../UserProfile';

export default function ModernAppLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Gestion du thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Gestion responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Écouter l'événement d'ouverture du profil
  useEffect(() => {
    const handleOpenProfile = () => setShowProfile(true);
    window.addEventListener('openProfile', handleOpenProfile);
    return () => window.removeEventListener('openProfile', handleOpenProfile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Overlay pour mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <ModernSidebar 
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={closeSidebar}
      />
      
      {/* Main Content */}
      <div 
        className="main-content"
        style={{
          marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px')
        }}
      >
        <ModernHeader 
          darkMode={darkMode} 
          onToggleTheme={toggleTheme}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onOpenProfile={() => setShowProfile(true)}
        />
        
        <main className="p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}