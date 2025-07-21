import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ 
  darkMode, 
  setDarkMode, 
  onToggleSidebar, 
  sidebarCollapsed, 
  isMobile,
  onOpenProfile 
}) {
  const { user } = useAuth();

  return (
    <header className={`sticky-top shadow-sm border-bottom ${
      darkMode ? 'bg-dark border-secondary' : 'bg-white border-light'
    }`}>
      <div className="container-fluid">
        <div className="row align-items-center py-3">
          <div className="col-auto">
            <button 
              className={`btn btn-link p-2 ${darkMode ? 'text-light' : 'text-dark'}`}
              onClick={onToggleSidebar}
              title={sidebarCollapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
            >
              <i className={`bi ${
                isMobile 
                  ? 'bi-list' 
                  : sidebarCollapsed 
                    ? 'bi-layout-sidebar' 
                    : 'bi-layout-sidebar-reverse'
              } fs-5`}></i>
            </button>
          </div>
          
          <div className="col">
            <div className="d-flex align-items-center">
              <div>
                <h4 className={`mb-0 fw-bold ${darkMode ? 'text-light' : 'text-dark'}`}>
                  Gestion Mutualiste
                </h4>
                <small className={darkMode ? 'text-light-emphasis' : 'text-muted'}>
                  Tableau de bord administratif
                </small>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="d-flex align-items-center gap-3">

              {/* Theme Toggle */}
              <button
                onClick={setDarkMode}
                className={`btn rounded-circle  ${
                  darkMode ? 'btn-dark' : 'btn-light'
                }`}
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'} fs-5`}></i>
              </button>

              {/* User Avatar */}
              <div className="dropdown">
                <button 
                  className="btn p-0 dropdown-toggle-no-caret"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                    }}
                  >
                    <span className="text-white fw-medium">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 className="dropdown-header">
                      {user?.first_name} {user?.last_name}
                    </h6>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={onOpenProfile}>
                      <i className="bi bi-person me-2"></i>Profil
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item">
                      <i className="bi bi-gear me-2"></i>Paramètres
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={setDarkMode}>
                      <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'} me-2`}></i>
                      {darkMode ? 'Mode clair' : 'Mode sombre'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}