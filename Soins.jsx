import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soinsAPI, adherentsAPI } from '../services/api';

export default function Soins() {
  const [soins, setSoins] = useState([]);
  const [adherents, setAdherents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    num_recu: '',
    nom: '',
    prenom: '',
    nax: '',
    statut_dossier: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSoin, setSelectedSoin] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    nax: '',
    num_recu: '',
    date_soin: '',
    date_fin_soin: '',
    montant_dossier: '',
    statut_dossier: '',
    type_beneficier: 'Adherent'
  });
  const [adherentTrouve, setAdherentTrouve] = useState(null);

  useEffect(() => {
    fetchSoins();
    fetchAdherents();
  }, []);

  useEffect(() => {
    if (formData.nax && adherents.length > 0) {
      const match = adherents.find(a => a.nax === formData.nax);
      setAdherentTrouve(match || null);
    } else {
      setAdherentTrouve(null);
    }
  }, [formData.nax, adherents]);

  const fetchSoins = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.num_recu) params['num_recu'] = filters.num_recu;
      if (filters.nom) params['adherent__nom'] = filters.nom;
      if (filters.prenom) params['adherent__prenom'] = filters.prenom;
      if (filters.nax) params['adherent__nax'] = filters.nax;
      if (filters.statut_dossier) params['statut_dossier'] = filters.statut_dossier;

      const response = await soinsAPI.getAll(params);
      setSoins(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erreur lors du chargement des soins'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdherents = async () => {
    try {
      const response = await adherentsAPI.getAll();
      setAdherents(response.data);
    } catch (error) {
      console.error('Error fetching adherents:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = Object.entries(searchFilters)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value.trim() }), {});
    
    fetchSoins(activeFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nax: '',
      num_recu: '',
      date_soin: '',
      date_fin_soin: '',
      montant_dossier: '',
      statut_dossier: '',
      type_beneficier: 'Adherent'
    });
    setAdherentTrouve(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adherent = adherents.find(a => a.nax === formData.nax);
    if (!adherent) {
      setAlert({
        type: 'error',
        message: 'Aucun adhérent trouvé avec ce NAX'
      });
      return;
    }

    if (adherent.a_droit !== 'ayant_droit') {
      setAlert({
        type: 'error',
        message: "L'adhérent n'a pas le droit de créer un dossier de soin."
      });
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        adherent_id: adherent.id
      };
      delete dataToSend.nax;

      const response = await soinsAPI.create(dataToSend);
      setAlert({
        type: 'success',
        message: 'Dossier soin ajouté avec succès'
      });

      const soinId = response.data.id;
      window.open(`http://127.0.0.1:8000/recu/${soinId}/`, '_blank');

      setShowAddModal(false);
      resetForm();
      fetchSoins();
    } catch (error) {
      setAlert({
        type: 'error',
        message: "Erreur lors de l'ajout du dossier"
      });
    }
  };

  const handleEdit = (soin) => {
    setSelectedSoin(soin);
    setFormData({
      nax: soin.adherent.nax,
      num_recu: soin.num_recu,
      date_soin: soin.date_soin,
      date_fin_soin: soin.date_fin_soin,
      montant_dossier: soin.montant_dossier,
      statut_dossier: soin.statut_dossier,
      type_beneficier: soin.type_beneficier || 'Adherent'
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        adherent_id: selectedSoin.adherent.id
      };
      delete dataToSend.nax;

      await soinsAPI.update(selectedSoin.id, dataToSend);

      setAlert({
        type: 'success',
        message: 'Dossier mis à jour avec succès'
      });

      window.open(`http://127.0.0.1:8000/recu/${selectedSoin.id}/`, '_blank');

      setShowEditModal(false);
      fetchSoins();
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erreur lors de la mise à jour'
      });
    }
  };

  const statutOptions = [
    { value: '', label: 'statut' },
    { value: 'recu', label: 'Reçu' },
    { value: 'rejet', label: 'Rejeté' }
  ];

  const statutFormOptions = [
    { value: '', label: 'Sélectionner statut' },
    { value: 'recu', label: 'Reçu' },
    { value: 'rejet', label: 'Rejeté' }
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold mb-2">
            <i className="bi bi-heart-pulse text-danger me-3"></i>
            Gestion des Soins
          </h1>
          <p className="text-muted fs-5">Gérez les dossiers de soins des adhérents</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-danger btn-lg shadow-sm"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Ajouter Dossier
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
          <i className={`bi ${alert.type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Search Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header  border-0">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-search me-2 text-primary"></i>
            Rechercher des dossiers de soins
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Numéro reçu"
                  name="num_recu"
                  maxLength={8}
                  value={searchFilters.num_recu}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom"
                  name="nom"
                  value={searchFilters.nom}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Prénom"
                  name="prenom"
                  value={searchFilters.prenom}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="NAX"
                  name="nax"
                  maxLength={6}
                  value={searchFilters.nax}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  name="statut_dossier"
                  value={searchFilters.statut_dossier}
                  onChange={handleSearchInputChange}
                >
                  {statutOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-search me-2"></i>
                  Rechercher
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Soins List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header  border-0">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="fw-bold mb-0">
              Liste des Dossiers de Soins ({soins.length})
            </h5>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => fetchSoins()}>
                <i className="bi bi-arrow-clockwise me-1"></i>Actualiser
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="text-muted">Chargement des dossiers de soins...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">Adhérent</th>
                  <th className="fw-semibold">NAX / Reçu</th>
                  <th className="fw-semibold">Période Soin</th>
                  <th className="fw-semibold">Montant</th>
                  <th className="fw-semibold">Statut</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {soins.map((soin) => (
                  <motion.tr
                    key={soin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="align-middle"
                  >
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                          }}
                        >
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-0">{soin.adherent?.prenom} {soin.adherent?.nom}</h6>
                          <small className="text-muted">{soin.type_beneficier}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">NAX: {soin.adherent?.nax}</div>
                        <small className="text-muted">Reçu: {soin.num_recu}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">Du: {new Date(soin.date_soin).toLocaleDateString('fr-FR')}</div>
                        <small className="text-muted">Au: {new Date(soin.date_fin_soin).toLocaleDateString('fr-FR')}</small>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-success">
                        {parseFloat(soin.montant_dossier).toLocaleString('fr-FR')} MAD
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        soin.statut_dossier === 'recu'
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}>
                        <i className={`bi ${soin.statut_dossier === 'recu' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                        {soin.statut_dossier === 'recu' ? 'Reçu' : 'Rejeté'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleEdit(soin)}
                          title="Modifier"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => window.open(`http://127.0.0.1:8000/recu/${soin.id}/`, '_blank')}
                          title="Télécharger le reçu"
                        >
                          <i className="bi bi-download"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {soins.length === 0 && !loading && (
              <div className="text-center py-5">
                <i className="bi bi-heart-pulse display-1 text-muted mb-3"></i>
                <h5 className="text-muted">Aucun dossier de soin trouvé</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-plus-circle me-2 text-danger"></i>
                  Ajouter un Dossier de Soin
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">NAX de l'adhérent <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Entrer le NAX"
                        name="nax"
                        maxLength={6}
                        value={formData.nax}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    {adherentTrouve && (
                      <div className="col-12">
                        <div className="alert alert-info d-flex align-items-center">
                          <i className="bi bi-person-check me-2"></i>
                          <div>
                            <strong>{adherentTrouve.prenom} {adherentTrouve.nom}</strong> trouvé(e)
                            <span className={`badge ms-2 ${
                              adherentTrouve.a_droit === 'ayant_droit' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {adherentTrouve.a_droit === 'ayant_droit' ? 'Ayant droit' : 'Sans droit'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Numéro reçu <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Numéro reçu"
                        name="num_recu"
                        maxLength={8}
                        value={formData.num_recu}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Statut du dossier <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="statut_dossier"
                        value={formData.statut_dossier}
                        onChange={handleInputChange}
                        required
                      >
                        {statutFormOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date de soin <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_soin"
                        value={formData.date_soin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date fin soin <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_fin_soin"
                        value={formData.date_fin_soin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Montant du dossier <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        placeholder="Montant"
                        name="montant_dossier"
                        value={formData.montant_dossier}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Type bénéficiaire</label>
                      <input
                        type="text"
                        className="form-control"
                        name="type_beneficier"
                        value={formData.type_beneficier}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  onClick={handleSubmit}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Ajouter le dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil me-2 text-warning"></i>
                  Modifier le Dossier de Soin
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info d-flex align-items-center mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  <div>
                    <strong>{selectedSoin?.adherent?.prenom} {selectedSoin?.adherent?.nom}</strong> 
                    (NAX: {selectedSoin?.adherent?.nax})
                  </div>
                </div>

                <form onSubmit={handleUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Numéro reçu <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Numéro reçu"
                        name="num_recu"
                        maxLength={8}
                        value={formData.num_recu}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Statut du dossier <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="statut_dossier"
                        value={formData.statut_dossier}
                        onChange={handleInputChange}
                        required
                      >
                        {statutFormOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date de soin <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_soin"
                        value={formData.date_soin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date fin soin <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_fin_soin"
                        value={formData.date_fin_soin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Montant du dossier <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        placeholder="Montant"
                        name="montant_dossier"
                        value={formData.montant_dossier}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Type bénéficiaire</label>
                      <input
                        type="text"
                        className="form-control"
                        name="type_beneficier"
                        value={formData.type_beneficier}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-warning"
                  onClick={handleUpdate}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}