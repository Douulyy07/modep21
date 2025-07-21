import React, { useState } from 'react';
import { User, Edit, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ModernModal from './UI/ModernModal';
import ModernInput from './UI/ModernInput';
import ModernButton from './UI/ModernButton';
import ModernCard from './UI/ModernCard';

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

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title="Profil Utilisateur"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avatar Section */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-success rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
                </div>
            <h3 className="text-xl font-bold text-primary mb-1">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-secondary mb-4">@{user?.username}</p>
            <div className="flex justify-center space-x-2">
              <span className="badge badge-success">
                <Check className="w-3 h-3" />
                <span>
                    Actif
                </span>
              </span>
                  {user?.is_staff && (
                <span className="badge badge-warning">
                  <User className="w-3 h-3" />
                  <span>
                      Admin
                  </span>
                </span>
                  )}
                </div>
              </div>

              {/* Information Section */}
          <div className="md:col-span-2">
            <ModernCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">Informations Personnelles</h3>
                    {!isEditing ? (
                  <ModernButton
                    variant="ghost"
                    size="sm"
                        onClick={() => setIsEditing(true)}
                    icon={<Edit className="w-4 h-4" />}
                      >
                        Modifier
                  </ModernButton>
                    ) : (
                  <div className="flex space-x-2">
                    <ModernButton
                      variant="success"
                      size="sm"
                          onClick={handleSave}
                      icon={<Check className="w-4 h-4" />}
                        >
                          Sauvegarder
                    </ModernButton>
                    <ModernButton
                      variant="ghost"
                      size="sm"
                          onClick={handleCancel}
                      icon={<X className="w-4 h-4" />}
                        >
                          Annuler
                    </ModernButton>
                      </div>
                    )}
                  </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                        {isEditing ? (
                      <ModernInput
                        label="Prénom"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                          />
                        ) : (
                      <div>
                        <label className="form-label">Prénom</label>
                        <p className="font-semibold text-primary">
                          {user?.first_name || 'Non renseigné'}
                        </p>
                      </div>
                        )}
                      </div>
                <div>
                        {isEditing ? (
                      <ModernInput
                        label="Nom"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                          />
                        ) : (
                      <div>
                        <label className="form-label">Nom</label>
                        <p className="font-semibold text-primary">
                          {user?.last_name || 'Non renseigné'}
                        </p>
                      </div>
                        )}
                      </div>
                <div>
                        {isEditing ? (
                      <ModernInput
                        label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        ) : (
                      <div>
                        <label className="form-label">Email</label>
                        <p className="font-semibold text-primary">
                          {user?.email || 'Non renseigné'}
                        </p>
                      </div>
                        )}
                      </div>
                <div>
                        {isEditing ? (
                      <ModernInput
                        label="Nom d'utilisateur"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                          />
                        ) : (
                      <div>
                        <label className="form-label">Nom d'utilisateur</label>
                        <p className="font-semibold text-primary">@{user?.username}</p>
                      </div>
                        )}
                      </div>
                    </div>
            </ModernCard>
              </div>

        </div>
      </div>
    </ModernModal>
  );
}