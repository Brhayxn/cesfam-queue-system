import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import foto from "../assets/logoCesfam2.png"

export default function Navbar() {
  // Definir rutas
  const roleRoutes = [
    { name: 'Ingreso S.U.R', path: '/ingresoUrgencia' },
    { name: 'Categorizar', path: '/categorizacion' },
    { name: 'Pacientes', path: '/pacientes' },
    { name: 'Atendidos', path: '/atendidos' }
  ];

  return (
    <>

      <nav className="navbar-glass text-gray-800 dark:text-white px-6 py-5 sticky top-0 z-50 relative ">
        <div className="fixed top-2 left-2" style={{width:'20vw'}}>
          <img
            src={foto}
            alt="Logo Cesfam"
            style={{ width: "20%" }}
          />
        </div>
        <ul className="flex items-center justify-center relative">
          <LogoutButton />
          {roleRoutes.map((link) => (
            <li key={link.path} className="group relative">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `nav-link px-6 py-3 rounded-xl font-medium text-lg transition-all duration-300 ${isActive
                    ? 'text-white glow-text bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-400 hover:bg-white/5 dark:hover:bg-white/10'
                  }`
                }
              >
                {link.name}
                {/* Línea decorativa */}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>

  );
}