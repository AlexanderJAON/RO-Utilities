import './App.css';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import Router from './routers/Router';

import { useLocation } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const location = useLocation();
  
  // Verifica si el usuario está en una ruta protegida (diferente de la ruta de login)
  const showMenu = location.pathname !== '/ropti' && location.pathname !== '/roptai';

  return (
    <>
      {showMenu && <Header />} {/* Muestra el menú solo desde /home en adelante */}
      <RouterProvider router={Router} />
    </>
  );
}

export default App;