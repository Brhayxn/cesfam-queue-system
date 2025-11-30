import { useState, useEffect } from 'react';
import { Home, Users, Menu, X , Clock, CheckCircle, BarChart4} from 'lucide-react';
import apiClient from '../assets/apiClient';
import foto from "../assets/logoCesfam.png"
import Swal from 'sweetalert2';
import { TopDias, TopCategorias, GraficoHoras } from './Graficos';
import socket from '../assets/ioClient';
import PacientesCard from './PacientesEstadoCard';
import UsuarioFormModal from './Forms/UsuarioForm';
import Reports from './VistaReporte';
import LogoutButton from './LogoutButton';
import useVerify from '../.hooks/verifySession';

// Componente Dashboard
const Dashboard = () => {
  const [topDias, setTopDias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [actividadDiaria, setActividadDiaria] = useState([])
  const [promedio, setPromedio] = useState([])
  const [pacientesHoy, setPacientesHoy] = useState([])
  const [pacientes, setPacientes] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar Promise.all para hacer las peticiones en paralelo
        const responses = await Promise.allSettled([
          apiClient.get('/api/reportes/topDias'),
          apiClient.get('/api/reportes/categorias'),
          apiClient.get('/api/reportes/actividadDiaria'),
          apiClient.get('/api/reportes/promedio'),
          apiClient.get('/api/reportes/pacientesDiarios'),
        ]);

        if (responses[0].status === 'fulfilled') setTopDias(responses[0].value.data);
        if (responses[1].status === 'fulfilled') setCategorias(responses[1].value.data);
        if (responses[2].status === 'fulfilled') setActividadDiaria(responses[2].value.data);
        if (responses[3].status === 'fulfilled') setPromedio(responses[3].value.data);
        if (responses[4].status === 'fulfilled') setPacientesHoy(responses[4].value.data);
        console.log(responses[0]);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    

    fetchData();
  }, []);




  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Contenedor principal flex-col */}
      <div className="flex flex-col h-[calc(100vh-2rem)] gap-2">

        {/* Fila superior (contenedor flex) */}
        <div className="flex flex-1 gap-2" >
          {/* Tarjeta 1 - Ocupa 2/5 del ancho */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4 border border-gray-200" style={{ height: '50vh' }}>
            <div className="flex items-center justify-center h-full text-4xl font-bold text-blue-600 ">
              <TopDias reporte={topDias} />
              </div>
          </div>

          {/* Tarjeta 2 - Ocupa 2/5 del ancho */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-5 border border-gray-200" style={{ height: '50vh' }}>
            <div className="flex items-center justify-center h-full text-4xl font-bold text-green-600">
              <TopCategorias data={categorias} />
            </div>
          </div>

          {/* Columna derecha - Responsive */}
          <div className="flex flex-col w-full md:w-1/5 gap-2 md:gap-4" style={{ minHeight: '50vh' }}>
            {/* Tarjeta 5 - Tiempo Promedio */}
            <div className="flex-1 flex justify-center bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex h-full">
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 md:p-3 bg-blue-100 rounded-full">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Tiempo Promedio
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                      {promedio.Promedio}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 6 - Pacientes Atendidos */}
            <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex flex-col h-full justify-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="p-2 md:p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Pacientes atendidos
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                      {promedio.RegistrosValidos}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-500">Estado</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs md:text-sm font-medium text-green-600">Atendidos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fila inferior (contenedor flex) */}
        <div className="flex flex-1 gap-2">
          {/* Tarjeta 3 - Ocupa 2/5 del ancho */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-center h-full text-4xl font-bold text-red-600"><GraficoHoras data={actividadDiaria} /></div>
          </div>



          {/* Tarjeta 7 - Ocupa 1/5 del ancho */}
          <div className="w-1/5 bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <PacientesCard estadosPacientes={pacientesHoy} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Gestión de Usuarios
const UserManagement = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      apiClient.get('/api/auth/').
        then(res => {
          setUsers(res.data)
        }).catch(err => {
          console.error(err)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteUser = async (id, nombre) => {
    Swal.fire({
      title: `¿Eliminar al usuario ${nombre}?`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          apiClient.delete(`/api/auth/${id}`).
            then(res => {
              if (res.status === 200) {
                Swal.fire("¡Muy bien!", "Usuario eliminado con exito", "success");
              }
            }).catch(err => {
              console.error(err)
            })
        } catch (error) {
          console.error(error)
        }
      } else if (result.isDenied) {
        Swal.fire("Proceso cancelado", "No se elimino al usuario", "info");
      }
    });

  }

  // Definir el handler como una función 
  const handleNewUser = () => {
    fetchUsers();
  };
  const handleDeleteUser = () => {
    fetchUsers()
  }



  useEffect(() => {
    fetchUsers()
    // 2. Añadimos el listener
    socket.on('usuarioNuevo', handleNewUser);
    socket.on('usuarioEliminado', handleDeleteUser);

    // 3. Limpiamos el listener
    return () => {
      socket.off('usuarioNuevo', handleNewUser);
      socket.off('usuarioEliminado', handleDeleteUser);
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <UsuarioFormModal />

      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.rol === 'medico' ? ('Gestionador de pacientes'):(user.rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  
                    <button className="text-red-600 hover:text-red-900"
                      onClick={() => { deleteUser(user.id, user.nombre) }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente principal con Sidebar
export default function MinimalSidebar() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useVerify('administrador')
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'reports', label: 'Reportes', icon: BarChart4 },
  ];

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <LogoutButton/>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 mb-2"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <img
            src={foto}
            alt="Logo Cesfam"
            className='w-40'
          />
        </div>


        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-auto h-8 bg-blue-500 rounded-full flex items-center justify-center p-2">
                <span className="text-white text-sm font-medium">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}