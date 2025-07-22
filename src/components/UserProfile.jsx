import React, { useState } from 'react';
import { User, Edit, Check, X, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Profil Employé</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tertiary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-accent to-success rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <User className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-secondary mb-4">@{user?.username}</p>
              
              <div className="flex justify-center gap-2 mb-6">
                <span className="badge badge-success">
                  <Check className="w-3 h-3" />
                  <span>Actif</span>
                </span>
                {user?.is_staff && (
                  <span className="badge badge-primary">
                    <Shield className="w-3 h-3" />
                    <span>Administrateur</span>
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis 2023</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>Casablanca, Maroc</span>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informations Personnelles</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost btn-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="btn btn-success btn-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Sauvegarder</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn-ghost btn-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>Annuler</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Prénom</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      ) : (
                        <p className="font-semibold text-primary">
                          {user?.first_name || 'Non renseigné'}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Nom</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      ) : (
                        <p className="font-semibold text-primary">
                          {user?.last_name || 'Non renseigné'}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-secondary" />
                          <p className="font-semibold text-primary">
                            {user?.email || 'Non renseigné'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Nom d'utilisateur</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      ) : (
                        <p className="font-semibold text-primary">@{user?.username}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informations Professionnelles</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Poste</label>
                      <p className="font-semibold text-primary">Administrateur Système</p>
                    </div>
                    <div>
                      <label className="form-label">Département</label>
                      <p className="font-semibold text-primary">Gestion Mutualiste</p>
                    </div>
                    <div>
                      <label className="form-label">Date d'embauche</label>
                      <p className="font-semibold text-primary">15 Mars 2023</p>
                    </div>
                    <div>
                      <label className="form-label">Statut</label>
                      <span className="badge badge-success">Actif</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Résumé d'activité</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">127</div>
                      <div className="text-sm text-secondary">Adhérents traités</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success mb-1">89</div>
                      <div className="text-sm text-secondary">Dossiers validés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning mb-1">15</div>
                      <div className="text-sm text-secondary">En attente</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}