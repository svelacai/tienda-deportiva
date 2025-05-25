import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Requerimientos from './Requerimientos';
import Productos from './Productos';
import Carrito from './Carrito';

// Componente que gestiona qué vista se muestra en función del estado global
const AppContent = () => {
  const { currentPage } = useContext(AppContext);

  switch (currentPage) {
    case 'requerimientos':
      return <Requerimientos />;
    case 'productos':
      return <Productos />;
    case 'carrito':
      return <Carrito />;
    default:
      return <Requerimientos />;
  }
};

export default AppContent;
