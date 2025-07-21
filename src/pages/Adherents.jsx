import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Edit, Download, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { adherentsAPI } from '../services/api';
import ModernCard from '../components/UI/ModernCard';
import ModernButton from '../components/UI/ModernButton';
import ModernInput from '../components/UI/ModernInput';
import ModernSelect from '../components/UI/ModernSelect';
import ModernModal from '../components/UI/ModernModal';
import ModernAlert from '../components/UI/ModernAlert';

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
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-success bg-opacity-10 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-success" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Gestion des Adhérents</h1>
            <p className="text-secondary">Gérez les adhérents de votre mutuelle</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <ModernButton
            variant="success"
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Ajouter un Adhérent
          </ModernButton>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <ModernAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Search Filters */}
      <ModernCard>
        <div className="flex items-center space-x-3 mb-6">
          <Search className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-primary">Rechercher un adhérent</h2>
        </div>
        <div>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <ModernInput
                  placeholder="Nom"
                  name="nom"
                  value={searchFilters.nom}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div>
                <ModernInput
                  placeholder="Prénom"
                  name="prenom"
                  value={searchFilters.prenom}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div>
                <ModernInput
                  placeholder="CIN"
                  name="cin"
                  maxLength={10}
                  value={searchFilters.cin}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div>
                <ModernInput
                  type="text"
                  placeholder="NAX"
                  name="nax"
                  maxLength={6}
                  value={searchFilters.nax}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div>
                <ModernSelect
                  name="statut"
                  value={searchFilters.statut}
                  onChange={handleSearchInputChange}
                  options={[
                    { value: '', label: 'Tous les statuts' },
                    { value: 'actif', label: 'Actif' },
                    { value: 'retraite', label: 'Retraité' }
                  ]}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernButton
                  type="submit"
                  variant="accent"
                  className="w-full"
                  icon={<Search className="w-4 h-4" />}
                >
                  Rechercher
                </ModernButton>
              </div>
            </div>
          </form>
        </div>
      </ModernCard>

      {/* Adherents List */}
      <ModernCard padding="p-0">
        <div className="p-6 border-b border-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">
              Liste des Adhérents ({adherents.length})
            </h2>
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={() => fetchAdherents()}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Actualiser
            </ModernButton>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Chargement des adhérents...</p>
          </div>
        ) : adherents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary mb-2">Aucun adhérent trouvé</h3>
            <p className="text-tertiary">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Adhérent</th>
                  <th>CIN / NAX</th>
                  <th>Statut</th>
                  <th>Droit</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adherents.map((adherent) => (
                  <motion.tr
                    key={adherent.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">{adherent.prenom} {adherent.nom}</h4>
                          <p className="text-sm text-secondary">{adherent.ville}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-primary">CIN: {adherent.cin}</p>
                        <p className="text-sm text-secondary">NAX: {adherent.nax}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        adherent.statut === 'actif' 
                          ? 'badge-success' 
                          : 'badge-secondary'
                      }`}>
                        {adherent.statut}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        adherent.a_droit === 'ayant_droit'
                          ? 'badge-accent'
                          : 'badge-error'
                      }`}>
                        {adherent.a_droit === 'ayant_droit' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Ayant droit</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            <span>Sans droit</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <ModernButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(adherent)}
                          icon={<Edit className="w-4 h-4" />}
                        />
                        <ModernButton
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`http://localhost:8000/api/adherents/${adherent.id}/carte/download/`, '_blank')}
                          icon={<Download className="w-4 h-4" />}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModernCard>

      {/* Add Modal */}
      <ModernModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Ajouter un Adhérent"
        size="lg"
      >
        <div className="max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ModernInput
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <ModernInput
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <ModernInput
                  label="CIN"
                  name="cin"
                  maxLength={10}
                  value={formData.cin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <ModernInput
                  label="Téléphone"
                  type="text"
                  name="numero_tel"
                  value={formData.numero_tel}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="RIB"
                  name="rib"
                  value={formData.rib}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="Ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="Date de naissance"
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernSelect
                  label="Sexe"
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleInputChange}
                  options={sexeOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  options={statutOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Droit"
                  name="a_droit"
                  value={formData.a_droit}
                  onChange={handleInputChange}
                  required
                  options={droitOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Organisme employeur"
                  name="organisme_employeur"
                  value={formData.organisme_employeur}
                  onChange={handleInputChange}
                  options={organismeOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Section cotisation"
                  name="section_cotisation"
                  value={formData.section_cotisation}
                  onChange={handleInputChange}
                  options={organismeOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernInput
                  label="Date de recrutement"
                  type="date"
                  name="date_recrutement"
                  value={formData.date_recrutement}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="Salaire"
                  type="number"
                  step="0.01"
                  name="salaire"
                  value={formData.salaire}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Adresse</label>
                <textarea
                  className="form-input"
                  name="adresse"
                  rows="3"
                  value={formData.adresse}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-light">
          <ModernButton
            variant="ghost"
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            Annuler
          </ModernButton>
          <ModernButton
            variant="success"
            onClick={handleSubmit}
            icon={<Plus className="w-4 h-4" />}
          >
            Ajouter l'adhérent
          </ModernButton>
        </div>
      </ModernModal>

      {/* Edit Modal */}
      <ModernModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier l'Adhérent"
        size="lg"
      >
        <div className="max-h-96 overflow-y-auto">
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ModernInput
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <ModernInput
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <ModernInput
                  label="CIN"
                  name="cin"
                  maxLength={10}
                  value={formData.cin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <ModernInput
                  label="Téléphone"
                  type="text"
                  name="numero_tel"
                  value={formData.numero_tel}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="RIB"
                  name="rib"
                  value={formData.rib}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="Ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="Date de naissance"
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernSelect
                  label="Sexe"
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleInputChange}
                  options={sexeOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  options={statutOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Organisme employeur"
                  name="organisme_employeur"
                  value={formData.organisme_employeur}
                  onChange={handleInputChange}
                  options={organismeOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernSelect
                  label="Section cotisation"
                  name="section_cotisation"
                  value={formData.section_cotisation}
                  onChange={handleInputChange}
                  options={organismeOptions}
                >
                </ModernSelect>
              </div>
              <div>
                <ModernInput
                  label="Date de recrutement"
                  type="date"
                  name="date_recrutement"
                  value={formData.date_recrutement}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <ModernInput
                  label="Salaire"
                  type="number"
                  step="0.01"
                  name="salaire"
                  value={formData.salaire}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Adresse</label>
                <textarea
                  className="form-input"
                  name="adresse"
                  rows="3"
                  value={formData.adresse}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-light">
          <ModernButton
            variant="ghost"
            onClick={() => setShowEditModal(false)}
          >
            Annuler
          </ModernButton>
          <ModernButton
            variant="warning"
            onClick={handleUpdate}
            icon={<Edit className="w-4 h-4" />}
          >
            Mettre à jour
          </ModernButton>
        </div>
      </ModernModal>
    </div>
  );
}