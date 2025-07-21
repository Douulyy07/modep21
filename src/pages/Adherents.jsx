@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
+import { Users, Search, Plus, Edit, Download, RefreshCw, UserCheck, UserX } from 'lucide-react';
 import { adherentsAPI } from '../services/api';
+import ModernCard from '../components/UI/ModernCard';
+import ModernButton from '../components/UI/ModernButton';
+import ModernInput from '../components/UI/ModernInput';
+import ModernSelect from '../components/UI/ModernSelect';
+import ModernModal from '../components/UI/ModernModal';
+import ModernAlert from '../components/UI/ModernAlert';
@@ .. @@
   return (
-    <div className="fade-in">
+    <div className="animate-fade-in space-y-8">
       {/* Header */}
-      <div className="row align-items-center mb-4">
-        <div className="col">
-          <h1 className="display-6 fw-bold  mb-2">
-            <i className="bi bi-people text-primary me-3"></i>
-            Gestion des Adhérents
-          </h1>
-          <p className="text-muted fs-5">Gérez les adhérents de votre mutuelle</p>
-        </div>
-        <div className="col-auto">
-          <button 
-            className="btn btn-primary btn-lg shadow-sm"
+      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
+        <div className="flex items-center space-x-3">
+          <div className="w-12 h-12 bg-success bg-opacity-10 rounded-xl flex items-center justify-center">
+            <Users className="w-6 h-6 text-success" />
+          </div>
+          <div>
+            <h1 className="text-3xl font-bold text-primary">Gestion des Adhérents</h1>
+            <p className="text-secondary">Gérez les adhérents de votre mutuelle</p>
+          </div>
+        </div>
+        <div className="mt-4 sm:mt-0">
+          <ModernButton
+            variant="success"
             onClick={() => setShowAddModal(true)}
+            icon={<Plus className="w-4 h-4" />}
           >
-            <i className="bi bi-person-plus me-2"></i>
             Ajouter un Adhérent
-          </button>
+          </ModernButton>
         </div>
       </div>

       {/* Alert */}
       {alert && (
-        <div className={`alert alert-${alert.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
-          <i className={`bi ${alert.type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
-          {alert.message}
-          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
-        </div>
+        <ModernAlert
+          type={alert.type}
+          message={alert.message}
+          onClose={() => setAlert(null)}
+        />
       )}

       {/* Search Filters */}
-      <div className="card border-0 shadow-sm mb-4">
-        <div className="card-header  border-0">
-          <h5 className="fw-bold mb-0">
-            <i className="bi bi-search me-2 text-primary"></i>
-            Rechercher un adhérent
-          </h5>
-        </div>
-        <div className="card-body">
+      <ModernCard>
+        <div className="flex items-center space-x-3 mb-6">
+          <Search className="w-5 h-5 text-accent" />
+          <h2 className="text-xl font-semibold text-primary">Rechercher un adhérent</h2>
+        </div>
+        <div>
           <form onSubmit={handleSearch}>
-            <div className="row g-3">
-              <div className="col-md-2">
-                <input
-                  type="text"
-                  className="form-control"
+            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
+              <div>
+                <ModernInput
                   placeholder="Nom"
                   name="nom"
                   value={searchFilters.nom}
                   onChange={handleSearchInputChange}
                 />
               </div>
-              <div className="col-md-2">
-                <input
-                  type="text"
-                  className="form-control"
+              <div>
+                <ModernInput
                   placeholder="Prénom"
                   name="prenom"
                   value={searchFilters.prenom}
                   onChange={handleSearchInputChange}
                 />
               </div>
-              <div className="col-md-2">
-                <input
-                  type="text"
-                  className="form-control"
+              <div>
+                <ModernInput
                   placeholder="CIN"
                   name="cin"
                   maxLength={10}
@@ -138,8 +148,8 @@
                   onChange={handleSearchInputChange}
                 />
               </div>
-              <div className="col-md-2">
-                <input
+              <div>
+                <ModernInput
                   type="text"
-                  className="form-control"
                   placeholder="NAX"
                   name="nax"
@@ -149,8 +159,8 @@
                   onChange={handleSearchInputChange}
                 />
               </div>
-              <div className="col-md-2">
-                <select
-                  className="form-select"
+              <div>
+                <ModernSelect
                   name="statut"
                   value={searchFilters.statut}
                   onChange={handleSearchInputChange}
+                  options={[
+                    { value: '', label: 'Tous les statuts' },
+                    { value: 'actif', label: 'Actif' },
+                    { value: 'retraite', label: 'Retraité' }
+                  ]}
                 >
-                  <option value="">Tous les statuts</option>
-                  <option value="actif">Actif</option>
-                  <option value="retraite">Retraité</option>
-                </select>
+                </ModernSelect>
               </div>
-              <div className="col-md-2">
-                <button type="submit" className="btn btn-primary w-100">
-                  <i className="bi bi-search me-2"></i>
+              <div>
+                <ModernButton
+                  type="submit"
+                  variant="accent"
+                  className="w-full"
+                  icon={<Search className="w-4 h-4" />}
+                >
                   Rechercher
-                </button>
+                </ModernButton>
               </div>
             </div>
           </form>
         </div>
-      </div>
+      </ModernCard>

       {/* Adherents List */}
-      <div className="card border-0 shadow-sm">
-        <div className="card-header  border-0">
-          <div className="d-flex align-items-center justify-content-between">
-            <h5 className="fw-bold mb-0">
-              Liste des Adhérents ({adherents.length})
-            </h5>
-            <div className="d-flex gap-2">
-              <button className="btn btn-outline-secondary btn-sm" onClick={() => fetchAdherents()}>
-                <i className="bi bi-arrow-clockwise me-1"></i>Actualiser
-              </button>
-            </div>
+      <ModernCard padding="p-0">
+        <div className="p-6 border-b border-light">
+          <div className="flex items-center justify-between">
+            <h2 className="text-xl font-semibold text-primary">
+              Liste des Adhérents ({adherents.length})
+            </h2>
+            <ModernButton
+              variant="ghost"
+              size="sm"
+              onClick={() => fetchAdherents()}
+              icon={<RefreshCw className="w-4 h-4" />}
+            >
+              Actualiser
+            </ModernButton>
           </div>
         </div>
         
         {loading ? (
-          <div className="card-body text-center py-5">
-            <div className="spinner-border text-primary mb-3" role="status">
-              <span className="visually-hidden">Chargement...</span>
+          <div className="p-12 text-center">
+            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
+            <p className="text-secondary">Chargement des adhérents...</p>
+          </div>
+        ) : adherents.length === 0 ? (
+          <div className="p-12 text-center">
+            <Users className="w-16 h-16 text-tertiary mx-auto mb-4" />
+            <h3 className="text-lg font-semibold text-secondary mb-2">Aucun adhérent trouvé</h3>
+            <p className="text-tertiary">Essayez de modifier vos critères de recherche</p>
+          </div>
+        ) : (
+          <div className="table-container">
+            <table className="table">
+              <thead>
+                <tr>
+                  <th>Adhérent</th>
+                  <th>CIN / NAX</th>
+                  <th>Statut</th>
+                  <th>Droit</th>
+                  <th className="text-center">Actions</th>
+                </tr>
+              </thead>
+              <tbody>
+                {adherents.map((adherent) => (
+                  <motion.tr
+                    key={adherent.id}
+                    initial={{ opacity: 0 }}
+                    animate={{ opacity: 1 }}
+                  >
+                    <td>
+                      <div className="flex items-center space-x-3">
+                        <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
+                          <Users className="w-5 h-5 text-success" />
+                        </div>
+                        <div>
+                          <h4 className="font-semibold text-primary">{adherent.prenom} {adherent.nom}</h4>
+                          <p className="text-sm text-secondary">{adherent.ville}</p>
+                        </div>
+                      </div>
+                    </td>
+                    <td>
+                      <div>
+                        <p className="font-medium text-primary">CIN: {adherent.cin}</p>
+                        <p className="text-sm text-secondary">NAX: {adherent.nax}</p>
+                      </div>
+                    </td>
+                    <td>
+                      <span className={`badge ${
+                        adherent.statut === 'actif' 
+                          ? 'badge-success' 
+                          : 'badge-secondary'
+                      }`}>
+                        {adherent.statut}
+                      </span>
+                    </td>
+                    <td>
+                      <span className={`badge ${
+                        adherent.a_droit === 'ayant_droit'
+                          ? 'badge-accent'
+                          : 'badge-error'
+                      }`}>
+                        {adherent.a_droit === 'ayant_droit' ? (
+                          <>
+                            <UserCheck className="w-3 h-3" />
+                            <span>Ayant droit</span>
+                          </>
+                        ) : (
+                          <>
+                            <UserX className="w-3 h-3" />
+                            <span>Sans droit</span>
+                          </>
+                        )}
+                      </span>
+                    </td>
+                    <td className="text-center">
+                      <div className="flex items-center justify-center space-x-2">
+                        <ModernButton
+                          variant="ghost"
+                          size="sm"
+                          onClick={() => handleEdit(adherent)}
+                          icon={<Edit className="w-4 h-4" />}
+                        />
+                        <ModernButton
+                          variant="ghost"
+                          size="sm"
+                          onClick={() => window.open(`http://localhost:8000/api/adherents/${adherent.id}/carte/download/`, '_blank')}
+                          icon={<Download className="w-4 h-4" />}
+                        />
+                      </div>
+                    </td>
+                  </motion.tr>
+                ))}
+              </tbody>
+            </table>
+          </div>
+        )}
+      </ModernCard>

       {/* Add Modal */}
-      {showAddModal && (
-        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
-          <div className="modal-dialog modal-xl">
-            <div className="modal-content">
-              <div className="modal-header">
-                <h5 className="modal-title fw-bold">
-                  <i className="bi bi-person-plus me-2 text-primary"></i>
-                  Ajouter un Adhérent
-                </h5>
-                <button type="button" className="btn-close" onClick={() => {
-                  setShowAddModal(false);
-                  resetForm();
-                }}></button>
-              </div>
-              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
+      <ModernModal
+        isOpen={showAddModal}
+        onClose={() => {
+          setShowAddModal(false);
+          resetForm();
+        }}
+        title="Ajouter un Adhérent"
+        size="lg"
+      >
+        <div className="max-h-96 overflow-y-auto">
                 <form onSubmit={handleSubmit}>
-                  <div className="row g-3">
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Nom <span className="text-danger">*</span></label>
-                      <input
-                        type="text"
-                        className="form-control"
+                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                    <div>
+                      <ModernInput
+                        label="Nom"
                         name="nom"
                         value={formData.nom}
                         onChange={handleInputChange}
                         required
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Prénom <span className="text-danger">*</span></label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="Prénom"
                         name="prenom"
                         value={formData.prenom}
                         onChange={handleInputChange}
                         required
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">CIN <span className="text-danger">*</span></label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="CIN"
                         name="cin"
                         maxLength={10}
                         value={formData.cin}
@@ -318,8 +328,8 @@
                         required
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Téléphone</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Téléphone"
                         type="text"
-                        className="form-control"
                         name="numero_tel"
                         value={formData.numero_tel}
@@ -327,8 +337,8 @@
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">RIB</label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="RIB"
                         name="rib"
                         value={formData.rib}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Ville</label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="Ville"
                         name="ville"
                         value={formData.ville}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Date de naissance</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Date de naissance"
                         type="date"
-                        className="form-control"
                         name="date_naissance"
                         value={formData.date_naissance}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Sexe</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Sexe"
                         name="sexe"
                         value={formData.sexe}
                         onChange={handleInputChange}
+                        options={sexeOptions}
                       >
-                        {sexeOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Statut</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Statut"
                         name="statut"
                         value={formData.statut}
                         onChange={handleInputChange}
+                        options={statutOptions}
                       >
-                        {statutOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Droit <span className="text-danger">*</span></label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Droit"
                         name="a_droit"
                         value={formData.a_droit}
                         onChange={handleInputChange}
                         required
+                        options={droitOptions}
                       >
-                        {droitOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Organisme employeur</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Organisme employeur"
                         name="organisme_employeur"
                         value={formData.organisme_employeur}
                         onChange={handleInputChange}
+                        options={organismeOptions}
                       >
-                        {organismeOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Section cotisation</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Section cotisation"
                         name="section_cotisation"
                         value={formData.section_cotisation}
                         onChange={handleInputChange}
+                        options={organismeOptions}
                       >
-                        {organismeOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Date de recrutement</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Date de recrutement"
                         type="date"
-                        className="form-control"
                         name="date_recrutement"
                         value={formData.date_recrutement}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Salaire</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Salaire"
                         type="number"
-                        className="form-control"
                         step="0.01"
                         name="salaire"
                         value={formData.salaire}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-12">
-                      <label className="form-label fw-medium">Adresse</label>
-                      <textarea
-                        className="form-control"
+                    <div className="md:col-span-2">
+                      <label className="form-label">Adresse</label>
+                      <textarea
+                        className="form-input"
                         name="adresse"
                         rows="3"
                         value={formData.adresse}
@@ -456,25 +466,20 @@
                   </div>
                 </form>
-              </div>
-              <div className="modal-footer">
-                <button
-                  type="button"
-                  className="btn btn-secondary"
-                  onClick={() => {
-                    setShowAddModal(false);
-                    resetForm();
-                  }}
-                >
-                  Annuler
-                </button>
-                <button
-                  type="submit"
-                  className="btn btn-primary"
-                  onClick={handleSubmit}
-                >
-                  <i className="bi bi-person-plus me-2"></i>
-                  Ajouter l'adhérent
-                </button>
-              </div>
-            </div>
-          </div>
         </div>
-      )}
+        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-light">
+          <ModernButton
+            variant="ghost"
+            onClick={() => {
+              setShowAddModal(false);
+              resetForm();
+            }}
+          >
+            Annuler
+          </ModernButton>
+          <ModernButton
+            variant="success"
+            onClick={handleSubmit}
+            icon={<Plus className="w-4 h-4" />}
+          >
+            Ajouter l'adhérent
+          </ModernButton>
+        </div>
+      </ModernModal>

       {/* Edit Modal */}
-      {showEditModal && (
-        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
-          <div className="modal-dialog modal-xl">
-            <div className="modal-content">
-              <div className="modal-header">
-                <h5 className="modal-title fw-bold">
-                  <i className="bi bi-pencil me-2 text-warning"></i>
-                  Modifier l'Adhérent
-                </h5>
-                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
-              </div>
-              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
+      <ModernModal
+        isOpen={showEditModal}
+        onClose={() => setShowEditModal(false)}
+        title="Modifier l'Adhérent"
+        size="lg"
+      >
+        <div className="max-h-96 overflow-y-auto">
                 <form onSubmit={handleUpdate}>
-                  <div className="row g-3">
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Nom <span className="text-danger">*</span></label>
-                      <input
-                        type="text"
-                        className="form-control"
+                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                    <div>
+                      <ModernInput
+                        label="Nom"
                         name="nom"
                         value={formData.nom}
                         onChange={handleInputChange}
                         required
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Prénom <span className="text-danger">*</span></label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="Prénom"
                         name="prenom"
                         value={formData.prenom}
                         onChange={handleInputChange}
                         required
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">CIN <span className="text-danger">*</span></label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="CIN"
                         name="cin"
                         maxLength={10}
                         value={formData.cin}
@@ -582,8 +587,8 @@
                         required
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Téléphone</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Téléphone"
                         type="text"
-                        className="form-control"
                         name="numero_tel"
                         value={formData.numero_tel}
@@ -591,8 +596,8 @@
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">RIB</label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="RIB"
                         name="rib"
                         value={formData.rib}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Ville</label>
-                      <input
-                        type="text"
-                        className="form-control"
+                    <div>
+                      <ModernInput
+                        label="Ville"
                         name="ville"
                         value={formData.ville}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Date de naissance</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Date de naissance"
                         type="date"
-                        className="form-control"
                         name="date_naissance"
                         value={formData.date_naissance}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Sexe</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Sexe"
                         name="sexe"
                         value={formData.sexe}
                         onChange={handleInputChange}
+                        options={sexeOptions}
                       >
-                        {sexeOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Statut</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Statut"
                         name="statut"
                         value={formData.statut}
                         onChange={handleInputChange}
+                        options={statutOptions}
                       >
-                        {statutOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Organisme employeur</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Organisme employeur"
                         name="organisme_employeur"
                         value={formData.organisme_employeur}
                         onChange={handleInputChange}
+                        options={organismeOptions}
                       >
-                        {organismeOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Section cotisation</label>
-                      <select
-                        className="form-select"
+                    <div>
+                      <ModernSelect
+                        label="Section cotisation"
                         name="section_cotisation"
                         value={formData.section_cotisation}
                         onChange={handleInputChange}
+                        options={organismeOptions}
                       >
-                        {organismeOptions.map(option => (
-                          <option key={option.value} value={option.value}>{option.label}</option>
-                        ))}
-                      </select>
+                      </ModernSelect>
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Date de recrutement</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Date de recrutement"
                         type="date"
-                        className="form-control"
                         name="date_recrutement"
                         value={formData.date_recrutement}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-md-6">
-                      <label className="form-label fw-medium">Salaire</label>
-                      <input
+                    <div>
+                      <ModernInput
+                        label="Salaire"
                         type="number"
-                        className="form-control"
                         step="0.01"
                         name="salaire"
                         value={formData.salaire}
                         onChange={handleInputChange}
                       />
                     </div>
-                    <div className="col-12">
-                      <label className="form-label fw-medium">Adresse</label>
-                      <textarea
-                        className="form-control"
+                    <div className="md:col-span-2">
+                      <label className="form-label">Adresse</label>
+                      <textarea
+                        className="form-input"
                         name="adresse"
                         rows="3"
                         value={formData.adresse}
@@ -720,21 +725,18 @@
                   </div>
                 </form>
-              </div>
-              <div className="modal-footer">
-                <button
-                  type="button"
-                  className="btn btn-secondary"
-                  onClick={() => setShowEditModal(false)}
-                >
-                  Annuler
-                </button>
-                <button
-                  type="submit"
-                  className="btn btn-warning"
-                  onClick={handleUpdate}
-                >
-                  <i className="bi bi-pencil me-2"></i>
-                  Mettre à jour
-                </button>
-              </div>
-            </div>
-          </div>
         </div>
-      )}
+        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-light">
+          <ModernButton
+            variant="ghost"
+            onClick={() => setShowEditModal(false)}
+          >
+            Annuler
+          </ModernButton>
+          <ModernButton
+            variant="warning"
+            onClick={handleUpdate}
+            icon={<Edit className="w-4 h-4" />}
+          >
+            Mettre à jour
+          </ModernButton>
+        </div>
+      </ModernModal>
     </div>
   );
 }