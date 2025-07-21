import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cotisationsAPI } from '../services/api';

export default function Cotisations() {
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    nom: '',
    prenom: '',
    cin: '',
    cotisation: ''
  });
  const [alert, setAlert] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newCotisationValue, setNewCotisationValue] = useState('');

  useEffect(() => {
    fetchCotisations();
  }, []);

  const fetchCotisations = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.nom) params['adherent__nom'] = filters.nom;
      if (filters.prenom) params['adherent__prenom'] = filters.prenom;
      if (filters.cin) params['cin'] = filters.cin;
      if (filters.cotisation) params['cotisation'] = filters.cotisation;

      const response = await cotisationsAPI.getAll(params);
      setCotisations(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erreur lors du chargement des cotisations'
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
    fetchCotisations(activeFilters);
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const canModify = (dateDebutStr) => {
    if (!dateDebutStr) return true;
    const dateDebut = new Date(dateDebutStr);
    const now = new Date();
    const diffMs = now - dateDebut;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  };

  const startEditing = (cotisation) => {
    if (!canModify(cotisation.date_debut)) {
      setAlert({
        type: 'error',
        message: 'Modification possible uniquement après 1 mois de la date de début.'
      });
      return;
    }
    setEditingId(cotisation.id);
    setNewCotisationValue(cotisation.cotisation);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewCotisationValue('');
  };

  const saveModification = async (id) => {
    try {
      const updateData = {
        cotisation: newCotisationValue,
        a_droit: newCotisationValue === 'oui' ? 'ayant_droit' : 'sans_droit',
        date_debut: newCotisationValue === 'oui' ? new Date().toISOString().slice(0, 10) : null,
        date_fin: newCotisationValue === 'oui' ? null : null
      };
      await cotisationsAPI.patch(id, updateData);
      setAlert({
        type: 'success',
        message: 'Cotisation mise à jour avec succès'
      });
      setEditingId(null);
      setNewCotisationValue('');
      fetchCotisations();
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erreur lors de la mise à jour de la cotisation'
      });
    }
  };

  const cotisationOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold mb-2">
            <i className="bi bi-credit-card text-warning me-3"></i>
            Gestion des Cotisations
          </h1>
          <p className="text-muted fs-5">Gérez les cotisations des adhérents</p>
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
            Rechercher des cotisations
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
                <select
                  className="form-select"
                  name="cotisation"
                  value={searchFilters.cotisation}
                  onChange={handleSearchInputChange}
                >
                  <option value="">Tous</option>
                  {cotisationOptions.map(option => (
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

      {/* Cotisations List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header  border-0">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="fw-bold mb-0">
              Liste des Cotisations ({cotisations.length})
            </h5>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => fetchCotisations()}>
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
            <p className="text-muted">Chargement des cotisations...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">Adhérent</th>
                  <th className="fw-semibold">CIN / NAX</th>
                  <th className="fw-semibold">Date Recrutement</th>
                  <th className="fw-semibold">Droit</th>
                  <th className="fw-semibold">Période</th>
                  <th className="fw-semibold">Cotisation</th>
                </tr>
              </thead>
              <tbody>
                {cotisations.map((cotisation) => {
                  const isEditing = editingId === cotisation.id;
                  return (
                    <motion.tr
                      key={cotisation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`align-middle ${isEditing ? 'table-warning' : ''}`}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                            }}
                          >
                            <i className="bi bi-person text-white"></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-0">{cotisation.prenom} {cotisation.nom}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">CIN: {cotisation.cin}</div>
                          <small className="text-muted">NAX: {cotisation.nax}</small>
                        </div>
                      </td>
                      <td>
                        {cotisation.date_recrutement
                          ? new Date(cotisation.date_recrutement).toLocaleDateString('fr-FR')
                          : '-'}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            cotisation.a_droit === 'ayant_droit'
                              ? 'bg-primary'
                              : 'bg-danger'
                          }`}
                        >
                          {cotisation.a_droit === 'ayant_droit'
                            ? 'Ayant droit'
                            : 'Sans droit'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">
                            Du: {cotisation.date_debut
                              ? new Date(cotisation.date_debut).toLocaleDateString('fr-FR')
                              : '-'}
                          </div>
                          <small className="text-muted">
                            Au: {cotisation.date_fin
                              ? new Date(cotisation.date_fin).toLocaleDateString('fr-FR')
                              : '-'}
                          </small>
                        </div>
                      </td>
                      <td>
                        {!isEditing ? (
                          <div className="d-flex align-items-center">
                            <span
                              className={`badge me-2 ${
                                cotisation.cotisation === 'oui'
                                  ? 'bg-success'
                                  : 'bg-danger'
                              }`}
                            >
                              <i className={`bi ${cotisation.cotisation === 'oui' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                              {cotisation.cotisation === 'oui' ? 'Oui' : 'Non'}
                            </span>
                            {canModify(cotisation.date_debut) && (
                              <button
                                onClick={() => startEditing(cotisation)}
                                className="btn btn-outline-warning btn-sm"
                                title="Modifier cotisation"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            )}
                          </div>
                        ) : null}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {cotisations.length === 0 && !loading && (
              <div className="text-center py-5">
                <i className="bi bi-credit-card display-1 text-muted mb-3"></i>
                <h5 className="text-muted">Aucune cotisation trouvée</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil me-2 text-warning"></i>
                  Modifier la cotisation
                </h5>
                <button type="button" className="btn-close" onClick={cancelEditing}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Statut de cotisation</label>
                  <select
                    value={newCotisationValue}
                    onChange={(e) => setNewCotisationValue(e.target.value)}
                    className="form-select"
                  >
                    {cotisationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelEditing}
                >
                  <i className="bi bi-x me-2"></i>
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => saveModification(editingId)}
                >
                  <i className="bi bi-check me-2"></i>
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}