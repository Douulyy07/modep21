@@ .. @@
 import React, { useState } from 'react';
+import { User, Edit, Check, X } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
+import ModernModal from './UI/ModernModal';
+import ModernInput from './UI/ModernInput';
+import ModernButton from './UI/ModernButton';
+import ModernCard from './UI/ModernCard';

 export default function UserProfile({ isOpen, onClose }) {
@@ .. @@
   };

-  if (!isOpen) return null;
-
   return (
-    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
-      <div className="modal-dialog modal-lg">
-        <div className="modal-content">
-          <div className="modal-header bg-primary text-white">
-            <h5 className="modal-title fw-bold">
-              <i className="bi bi-person-circle me-2"></i>
-              Profil Utilisateur
-            </h5>
-            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
-          </div>
-          
-          <div className="modal-body">
-            <div className="row">
+    <ModernModal
+      isOpen={isOpen}
+      onClose={onClose}
+      title="Profil Utilisateur"
+      size="lg"
+    >
+      <div className="space-y-6">
+        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Avatar Section */}
-              <div className="col-md-4 text-center mb-4">
-                <div 
-                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
-                  style={{ 
-                    width: '120px', 
-                    height: '120px', 
-                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
-                  }}
-                >
-                  <i className="bi bi-person text-white" style={{ fontSize: '3rem' }}></i>
+          <div className="text-center">
+            <div className="w-24 h-24 bg-gradient-to-br from-accent to-success rounded-2xl flex items-center justify-center mx-auto mb-4">
+              <User className="w-12 h-12 text-white" />
                 </div>
-                <h4 className="fw-bold ">{user?.first_name} {user?.last_name}</h4>
-                <p className="text-muted">@{user?.username}</p>
-                <div className="d-flex justify-content-center gap-2">
-                  <span className="badge bg-success">
-                    <i className="bi bi-check-circle me-1"></i>
+            <h3 className="text-xl font-bold text-primary mb-1">
+              {user?.first_name} {user?.last_name}
+            </h3>
+            <p className="text-secondary mb-4">@{user?.username}</p>
+            <div className="flex justify-center space-x-2">
+              <span className="badge badge-success">
+                <Check className="w-3 h-3" />
+                <span>
                     Actif
-                  </span>
+                </span>
+              </span>
                   {user?.is_staff && (
-                    <span className="badge bg-warning">
-                      <i className="bi bi-shield-check me-1"></i>
+                <span className="badge badge-warning">
+                  <User className="w-3 h-3" />
+                  <span>
                       Admin
-                    </span>
+                  </span>
+                </span>
                   )}
                 </div>
               </div>

               {/* Information Section */}
-              <div className="col-md-8">
-                <div className="card border-0 ">
-                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
-                    <h6 className="fw-bold mb-0">Informations Personnelles</h6>
+          <div className="md:col-span-2">
+            <ModernCard>
+              <div className="flex items-center justify-between mb-6">
+                <h3 className="text-lg font-semibold text-primary">Informations Personnelles</h3>
                     {!isEditing ? (
-                      <button 
-                        className="btn btn-outline-primary btn-sm"
+                  <ModernButton
+                    variant="ghost"
+                    size="sm"
                         onClick={() => setIsEditing(true)}
+                    icon={<Edit className="w-4 h-4" />}
                       >
-                        <i className="bi bi-pencil me-1"></i>
                         Modifier
-                      </button>
+                  </ModernButton>
                     ) : (
-                      <div className="btn-group">
-                        <button 
-                          className="btn btn-success btn-sm"
+                  <div className="flex space-x-2">
+                    <ModernButton
+                      variant="success"
+                      size="sm"
                           onClick={handleSave}
+                      icon={<Check className="w-4 h-4" />}
                         >
-                          <i className="bi bi-check me-1"></i>
                           Sauvegarder
-                        </button>
-                        <button 
-                          className="btn btn-secondary btn-sm"
+                    </ModernButton>
+                    <ModernButton
+                      variant="ghost"
+                      size="sm"
                           onClick={handleCancel}
+                      icon={<X className="w-4 h-4" />}
                         >
-                          <i className="bi bi-x me-1"></i>
                           Annuler
-                        </button>
+                    </ModernButton>
                       </div>
                     )}
                   </div>
-                  <div className="card-body">
-                    <div className="row g-3">
-                      <div className="col-md-6">
-                        <label className="form-label fw-medium text-muted">Prénom</label>
+              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                <div>
                         {isEditing ? (
-                          <input
-                            type="text"
-                            className="form-control"
+                      <ModernInput
+                        label="Prénom"
                             name="first_name"
                             value={formData.first_name}
                             onChange={handleInputChange}
                           />
                         ) : (
-                          <p className="fw-semibold">{user?.first_name || 'Non renseigné'}</p>
+                      <div>
+                        <label className="form-label">Prénom</label>
+                        <p className="font-semibold text-primary">
+                          {user?.first_name || 'Non renseigné'}
+                        </p>
+                      </div>
                         )}
                       </div>
-                      <div className="col-md-6">
-                        <label className="form-label fw-medium text-muted">Nom</label>
+                <div>
                         {isEditing ? (
-                          <input
-                            type="text"
-                            className="form-control"
+                      <ModernInput
+                        label="Nom"
                             name="last_name"
                             value={formData.last_name}
                             onChange={handleInputChange}
                           />
                         ) : (
-                          <p className="fw-semibold">{user?.last_name || 'Non renseigné'}</p>
+                      <div>
+                        <label className="form-label">Nom</label>
+                        <p className="font-semibold text-primary">
+                          {user?.last_name || 'Non renseigné'}
+                        </p>
+                      </div>
                         )}
                       </div>
-                      <div className="col-md-6">
-                        <label className="form-label fw-medium text-muted">Email</label>
+                <div>
                         {isEditing ? (
-                          <input
+                      <ModernInput
+                        label="Email"
                             type="email"
-                            className="form-control"
                             name="email"
                             value={formData.email}
                             onChange={handleInputChange}
                           />
                         ) : (
-                          <p className="fw-semibold">{user?.email || 'Non renseigné'}</p>
+                      <div>
+                        <label className="form-label">Email</label>
+                        <p className="font-semibold text-primary">
+                          {user?.email || 'Non renseigné'}
+                        </p>
+                      </div>
                         )}
                       </div>
-                      <div className="col-md-6">
-                        <label className="form-label fw-medium text-muted">Nom d'utilisateur</label>
+                <div>
                         {isEditing ? (
-                          <input
-                            type="text"
-                            className="form-control"
+                      <ModernInput
+                        label="Nom d'utilisateur"
                             name="username"
                             value={formData.username}
                             onChange={handleInputChange}
                           />
                         ) : (
-                          <p className="fw-semibold">@{user?.username}</p>
+                      <div>
+                        <label className="form-label">Nom d'utilisateur</label>
+                        <p className="font-semibold text-primary">@{user?.username}</p>
+                      </div>
                         )}
                       </div>
                     </div>
-                  </div>
-                </div>
-
-                
+            </ModernCard>
               </div>
-            </div>
-          </div>

-          <div className="modal-footer">
-            <button type="button" className="btn btn-secondary" onClick={onClose}>
-              Fermer
-            </button>
-          </div>
         </div>
       </div>
-    </div>
+    </ModernModal>
   );
 }