import React from 'react';
import RechercherCotisation from './Cotisation/Recherche';
import GestionCotisation from './Cotisation/gestion';

export default function Cotisation() {
  return (
    <div>
        <RechercherCotisation />
        <GestionCotisation />
    </div>
  );
}
