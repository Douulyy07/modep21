import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      username: user?.username || ''
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-circle me-2"></i>
              Profil Utilisateur
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              {/* Avatar Section */}
              <div className="col-md-4 text-center mb-4">
                <div 
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  }}
                >
                  <i className="bi bi-person text-white" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="fw-bold ">{user?.first_name} {user?.last_name}</h4>
                <p className="text-muted">@{user?.username}</p>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Actif
                  </span>
                  {user?.is_staff && (
                    <span className="badge bg-warning">
                      <i className="bi bi-shield-check me-1"></i>
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Information Section */}
              <div className="col-md-8">
                <div className="card border-0 ">
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">Informations Personnelles</h6>
                    {!isEditing ? (
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Modifier
                      </button>
                    ) : (
                      <div className="btn-group">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={handleSave}
                        >
                          <i className="bi bi-check me-1"></i>
                          Sauvegarder
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          <i className="bi bi-x me-1"></i>
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted">Prénom</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="fw-semibold">{user?.first_name || 'Non renseigné'}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted">Nom</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="fw-semibold">{user?.last_name || 'Non renseigné'}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="fw-semibold">{user?.email || 'Non renseigné'}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-muted">Nom d'utilisateur</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="fw-semibold">@{user?.username}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}