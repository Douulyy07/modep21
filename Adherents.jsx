import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adherentsAPI } from '../services/api';

export default function Adherents() {
  const [adherents, setAdherents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    nom: '',
    prenom: '',
    cin: '',
    nax: '',
    statut: '',
    a_droit: ''
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdherent, setSelectedAdherent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    numero_tel: '',
    rib: '',
    ville: '',
    date_naissance: '',
    sexe: '',
    adresse: '',
    organisme_employeur: '',
    section_cotisation: '',
    date_recrutement: '',
    salaire: '',
    statut: '',
    a_droit: ''
  });

  useEffect(() => {
    fetchAdherents();
  }, []);

  const fetchAdherents = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await adherentsAPI.getAll(filters);
      setAdherents(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erreur lors du chargement des adhérents'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = Object.entries(searchFilters)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value.trim() }), {});
    
    fetchAdherents(activeFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === 'organisme_employeur') {
        return {
          ...prev,
          organisme_employeur: value,
          section_cotisation: value
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      cin: '',
      numero_tel: '',
      rib: '',
      ville: '',
      date_naissance: '',
      sexe: '',
      adresse: '',
      organisme_employeur: '',
      section_cotisation: '',
      date_recrutement: '',
      salaire: '',
      statut: '',
      a_droit: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adherentsAPI.create(formData);
      setAlert({
        type: 'success',
        message: 'Adhérent ajouté avec succès'
      });
      
      const newId = response.data.id;
      window.open(`http://localhost:8000/api/adherents/${newId}/carte/download/`, '_blank');
      
      setShowAddModal(false);
      resetForm();
      fetchAdherents();
    } catch (error) {
      const errorMessage = error.response?.data 
        ? Object.entries(error.response.data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ')
        : 'Erreur lors de l\'ajout de l\'adhérent';
      
      setAlert({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const handleEdit = (adherent) => {
    setSelectedAdherent(adherent);
    setFormData({ ...adherent });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adherentsAPI.update(selectedAdherent.id, formData);
      setAlert({
        type: 'success',
        message: 'Adhérent mis à jour avec succès'
      });
      setShowEditModal(false);
      fetchAdherents();
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erreur lors de la mise à jour'
      });
    }
  };

  const sexeOptions = [
    { value: '', label: 'Sélectionner sexe' },
    { value: 'homme', label: 'Homme' },
    { value: 'femme', label: 'Femme' }
  ];

  const statutOptions = [
    { value: '', label: 'Sélectionner statut' },
    { value: 'actif', label: 'Actif' },
    { value: 'retraite', label: 'Retraité' }
  ];

  const droitOptions = [
    { value: '', label: 'Sélectionner droit' },
    { value: 'ayant_droit', label: 'Ayant droit' },
    { value: 'sans_droit', label: 'Sans droit' }
  ];

  const organismeOptions = [
    { value: '', label: 'Sélectionner organisme' },
    { value: 'anp', label: 'ANP' },
    { value: 'marsa_maroc', label: 'Marsa Maroc' },
    { value: 'modep', label: 'Modep' }
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold  mb-2">
            <i className="bi bi-people text-primary me-3"></i>
            Gestion des Adhérents
          </h1>
          <p className="text-muted fs-5">Gérez les adhérents de votre mutuelle</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary btn-lg shadow-sm"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-person-plus me-2"></i>
            Ajouter un Adhérent
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
            Rechercher un adhérent
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
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
                  placeholder="CIN"
                  name="cin"
                  maxLength={10}
                  value={searchFilters.cin}
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
                  name="statut"
                  value={searchFilters.statut}
                  onChange={handleSearchInputChange}
                >
                  <option value="">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="retraite">Retraité</option>
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

      {/* Adherents List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header  border-0">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="fw-bold mb-0">
              Liste des Adhérents ({adherents.length})
            </h5>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => fetchAdherents()}>
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
            <p className="text-muted">Chargement des adhérents...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">Adhérent</th>
                  <th className="fw-semibold">CIN / NAX</th>
                  <th className="fw-semibold">Statut</th>
                  <th className="fw-semibold">Droit</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adherents.map((adherent) => (
                  <motion.tr
                    key={adherent.id}
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
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                          }}
                        >
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-0">{adherent.prenom} {adherent.nom}</h6>
                          <small className="text-muted">{adherent.ville}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">CIN: {adherent.cin}</div>
                        <small className="text-muted">NAX: {adherent.nax}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        adherent.statut === 'actif' 
                          ? 'bg-success' 
                          : 'bg-secondary'
                      }`}>
                        {adherent.statut}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        adherent.a_droit === 'ayant_droit'
                          ? 'bg-primary'
                          : 'bg-danger'
                      }`}>
                        {adherent.a_droit === 'ayant_droit' ? 'Ayant droit' : 'Sans droit'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(adherent)}
                          title="Modifier"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => window.open(`http://localhost:8000/api/adherents/${adherent.id}/carte/download/`, '_blank')}
                          title="Télécharger la carte"
                        >
                          <i className="bi bi-download"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {adherents.length === 0 && !loading && (
              <div className="text-center py-5">
                <i className="bi bi-people display-1 text-muted mb-3"></i>
                <h5 className="text-muted">Aucun adhérent trouvé</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-plus me-2 text-primary"></i>
                  Ajouter un Adhérent
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Nom <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Prénom <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">CIN <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="cin"
                        maxLength={10}
                        value={formData.cin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="numero_tel"
                        value={formData.numero_tel}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">RIB</label>
                      <input
                        type="text"
                        className="form-control"
                        name="rib"
                        value={formData.rib}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Ville</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date de naissance</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_naissance"
                        value={formData.date_naissance}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Sexe</label>
                      <select
                        className="form-select"
                        name="sexe"
                        value={formData.sexe}
                        onChange={handleInputChange}
                      >
                        {sexeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Statut</label>
                      <select
                        className="form-select"
                        name="statut"
                        value={formData.statut}
                        onChange={handleInputChange}
                      >
                        {statutOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Droit <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="a_droit"
                        value={formData.a_droit}
                        onChange={handleInputChange}
                        required
                      >
                        {droitOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Organisme employeur</label>
                      <select
                        className="form-select"
                        name="organisme_employeur"
                        value={formData.organisme_employeur}
                        onChange={handleInputChange}
                      >
                        {organismeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Section cotisation</label>
                      <select
                        className="form-select"
                        name="section_cotisation"
                        value={formData.section_cotisation}
                        onChange={handleInputChange}
                      >
                        {organismeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date de recrutement</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_recrutement"
                        value={formData.date_recrutement}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Salaire</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salaire"
                        step="0.01"
                        value={formData.salaire}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Adresse</label>
                      <textarea
                        className="form-control"
                        name="adresse"
                        rows="3"
                        value={formData.adresse}
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
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Ajouter l'adhérent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil me-2 text-warning"></i>
                  Modifier l'Adhérent
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <form onSubmit={handleUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Nom <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Prénom <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">CIN <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="cin"
                        maxLength={10}
                        value={formData.cin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="numero_tel"
                        value={formData.numero_tel}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">RIB</label>
                      <input
                        type="text"
                        className="form-control"
                        name="rib"
                        value={formData.rib}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Ville</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date de naissance</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_naissance"
                        value={formData.date_naissance}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Sexe</label>
                      <select
                        className="form-select"
                        name="sexe"
                        value={formData.sexe}
                        onChange={handleInputChange}
                      >
                        {sexeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Statut</label>
                      <select
                        className="form-select"
                        name="statut"
                        value={formData.statut}
                        onChange={handleInputChange}
                      >
                        {statutOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Organisme employeur</label>
                      <select
                        className="form-select"
                        name="organisme_employeur"
                        value={formData.organisme_employeur}
                        onChange={handleInputChange}
                      >
                        {organismeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Section cotisation</label>
                      <select
                        className="form-select"
                        name="section_cotisation"
                        value={formData.section_cotisation}
                        onChange={handleInputChange}
                      >
                        {organismeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date de recrutement</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_recrutement"
                        value={formData.date_recrutement}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Salaire</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salaire"
                        step="0.01"
                        value={formData.salaire}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Adresse</label>
                      <textarea
                        className="form-control"
                        name="adresse"
                        rows="3"
                        value={formData.adresse}
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