import { useState, useEffect } from 'react'
import { Navigate,BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PacientesLista from './Components/PacientesLista';
import AtendidosLista from './Components/AtendidosLista';
import Navbar from './Components/navbar';
import IngresoPaciente from './Components/Forms/IngresoForm';
import IngresadosLista from './Components/IngresadosLista';
import Login from './Components/Login';
import ListaPublica from './Components/VistaPublica';
import MinimalSidebar from './Components/AdminView';
import IngresoUrgencia from './Components/Forms/IngresoUrgencia';

//AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

function AppContent() {
  
  useEffect(() => {
    AOS.init({
      // Opciones globales:
      duration: 800, // Duración de la animación en ms
      easing: 'ease-in-out', // Tipo de easing
      once: false, // Si la animación solo ocurre una vez
      mirror: true,
      disableMutationObserver: false, // Necesario para dinámico DOM (React/Next.js)
      throttleDelay: 99,   
    });
  }, []);
  
  const location = useLocation();

  const notNavBar = ['/public', '/ingreso','/login','/admin'];
  const ocultarNavbar = notNavBar.includes(location.pathname);
  //Recuerda que el rol 'medico' no fue remplazado solo se cambio la forma en la que se ve
  return (
    <>
      {!ocultarNavbar && <Navbar />}
      <div className=''>
        <Routes>
          {/* Ruta raíz redirige a /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Tus otras rutas */}
          <Route path="/login" element={<Login />} />
          <Route path="/atendidos" element={<AtendidosLista />} />
          <Route path="/ingreso" element={<IngresoPaciente />} />
          <Route path="/ingresoUrgencia" element={<IngresoUrgencia />} />
          <Route path="/categorizacion" element={<IngresadosLista />} />
          <Route path="/public" element={<ListaPublica />} />
          <Route path="/pacientes" element={<PacientesLista />} />
          <Route path="/admin" element={<MinimalSidebar />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent/>
    </Router>
  );
}

export default App
