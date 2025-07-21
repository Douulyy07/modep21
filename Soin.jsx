import React from 'react';
import AjouterSoin from './Soin/Ajout';
import ModifierSoin from './Soin/Modif';
import RechercherSoin from './Soin/Recherche';

export default function Soin() {
  return (
    <div>
      <h2>Gestion des Soins</h2>
      <AjouterSoin />
      <ModifierSoin />
      <RechercherSoin />
    </div>
  );
}
