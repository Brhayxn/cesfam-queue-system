import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../assets/apiClient";
import { jwtDecode } from "jwt-decode"
import fondo from "../assets/4.png"
import logo from "../assets/logoCesfam.png"
import Swal from 'sweetalert2'


export default function Login() {
  const [nombre, setNombre] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  

  const login = () => {
    if(nombre.length < 3){
        Swal.fire({
          icon: 'error',
          title: 'No se ingreso un nombre valido'
        })
        return
    }

    if(pass.length === 0){
      
        Swal.fire({
          icon: 'error',
          title: 'Ingrese la contraseña'
        })

        return
    }

    let decode = '';
    apiClient.post('/api/auth/', { username: nombre, pass: pass })
      .then(res => {
        sessionStorage.setItem("token", res.data.token) 
        const decode = jwtDecode(res.data.token)
        sessionStorage.setItem("userRol", decode.rol)
        if (decode.rol === "medico") {
          navigate("/pacientes")
        } else if (decode.rol === "categorizador") {
          navigate("/categorizacion")
        } else if (decode.rol === "acceso") {
          navigate("/ingreso")
        } else if (decode.rol === "administrador") {
          navigate("/admin")
        }
      })
      .catch(error => {
        
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: error.response?.data?.error || 'Ocurrió un error al iniciar sesión',
        })
      })

  };
  return (
 <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `url(${fondo})`,
        backgroundPosition: 'center'
      }}
    >
      {/* Contenedor principal con flexbox mejorado */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card del formulario con mejor diseño */}
          <div className="bg-white backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex justify-center">
              <img src={logo} alt="logo cesfam" style={{width:"50%"}}/>
            </div>
            
            
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido
              </h2>
              <p className="text-gray-600 text-sm">
                Inicia sesión en tu cuenta
              </p>
            </div>
       

            {/* Formulario */}
            <div className="space-y-6 mt-4">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <label 
                  htmlFor="nombre" 
                  className="block text-sm font-semibold text-gray-700"
                >
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label 
                  htmlFor="contraseña" 
                  className="block text-sm font-semibold text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="contraseña"
                  name="contraseña"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>



              {/* Botón de login mejorado */}
              <button
                autoFocus
                onClick={login}
                className="w-full bg-gradient-to-r from-blue-200 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-700 transform hover:scale-[2.02] active:scale-[1.98] shadow-lg"

              >
                Iniciar Sesión
              </button>
            </div>


          </div>


        </div>
      </div>
    </div>
  );
}
