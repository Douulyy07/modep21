import React from 'react';
import AjouterAdherent from './Adherent/Ajout';
import ModifierAdherent from './Adherent/Modif';
import RechercherAdherent from './Adherent/Recherche';

export default function Adhesion() {
  return (
    <div>
      <h2>Gestion des Adhérents</h2>
      <AjouterAdherent />
      <ModifierAdherent />
      <RechercherAdherent />
    </div>
  );
}
