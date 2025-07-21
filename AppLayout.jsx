import React, { useState, useEffect } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import Header from '../Header';
import UserProfile from '../UserProfile';

export default function AppLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Gestion du thème sombre
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Appliquer le thème à l'élément HTML
    if (darkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Gestion responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992; // Bootstrap lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
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
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-vh-100 ${darkMode ? 'dark-theme' : ''}`}>
      <CollapsibleSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      
      <div 
        className="main-content"
        style={{
          marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px'),
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Header 
          darkMode={darkMode} 
          setDarkMode={toggleTheme}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onOpenProfile={() => setShowProfile(true)}
        />
        
        <main className="p-4">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>

      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}