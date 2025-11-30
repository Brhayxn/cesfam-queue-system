import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import apiClient from '../assets/apiClient';
import socket from '../assets/ioClient';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Swal from 'sweetalert2'
import foto from "../assets/logoCesfam2.png"
import useVerify from '../.hooks/verifySession';
import BoxModal from './modals/BoxModal';


export default function IngresadosLista() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useVerify("medico")

  const getPacientes = async () => {
    const url = '/api/pacientes/estado?state=Ingresado';
    apiClient.get(url)
      .then(res => {
        setPacientes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    getPacientes()
    // Escuchar nuevo paciente
    socket.on("pacienteNuevo", (nuevoPaciente) => {
      getPacientes()
    });
    // Escuchar actualización
    socket.on("actualizacionPaciente", (pacienteActualizado) => {
      getPacientes()
    });
    // Limpieza de sockets
    return () => {
      socket.off("pacienteNuevo");
      socket.off("actualizacionPaciente");
    };
  }, []);

  const actualizarCategoria = async (paciente, categorizacion) => {
    console.log(categorizacion)
    if(categorizacion === ""){
      Swal.fire({
        icon: 'info',
        title: 'Debe seleccionar una categoria'
      })
      return
    }

    if (categorizacion === 'Cancelado') {
      try {
        Swal.fire({
          title: `Cancelar atencion a \n${paciente.nombre}\n Rut: ${paciente.rut}`,
          showDenyButton: true,
          confirmButtonText: "Aceptar",
          denyButtonText: `Cancelar`,
          icon: 'info'
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire("Cancelacion exitosa!", "Se registro la cancelacion de atencion.", "success");
            try {
              await apiClient.put(`/api/pacientes/${paciente.id}`, { estado: categorizacion });
              getPacientes()
            } catch (error) {
              console.error("Error al actualizar estado:", error);
            }
          } else if (result.isDenied) {
            Swal.fire("Proceso cancelado", "No se registro la cancelacion de la atencion.", "info");
          }
        });
      } catch (error) {
        console.error("Error al comunicarse con el servidor", error);
      }
    } else {
      const data = {
        "estado": "En espera",
        "categoria": categorizacion,
        "createdAt": new Date()
      }
      try {
        Swal.fire({
          title: `Categorizar a ${paciente.nombre}\n Rut: ${paciente.rut}`,
          showDenyButton: true,
          confirmButtonText: "Aceptar",
          denyButtonText: `Cancelar`
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire("Excelente!", "El paciente ha sido categorizado con exito.", "success");
            await apiClient.put(`/api/pacientes/${paciente.id}`, data);
          } else if (result.isDenied) {
            Swal.fire("Proceso cancelado", "El paciente no fue categorizado.", "info");
          }
        });
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }

    }



  };

return (
    <>
      <LogoutButton />
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div data-aos='fade-right' className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12" style={{minHeight:'70vh'}}>

              {/* Sección izquierda - Logo e información */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:col-span-4 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                {/* Elementos decorativos de fondo */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-12 translate-y-12"></div>

                <div className="relative z-10 text-center">
                  {/* Logo placeholder - reemplaza con tu imagen */}
                  <div className="w-48 h-48 bg-white/20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
                    <img src={foto} alt="logo" />
                  </div>

                  <h1 className="text-4xl font-bold mb-1">CESFAM</h1>
                  <h3 className="text-2xl font-semibold mb-6">Yerbas Buenas</h3>
                </div>
              </div>

              {/* Sección derecha - Formulario */}
              <div className="flex flex-col p-6 lg:col-span-8 p-8">
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 flex gap-2">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Pacientes ingresados
                    </h1>
                    </div>
                  </div>

                  {/* Tabla con scroll */}
                  <div className="flex-1 bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden flex flex-col ">
                    {/* Header de la tabla fijo */}
                    <div className="bg-blue-100 border-b border-gray-300">
                      <div className="grid grid-cols-4 gap-4 px-6 py-4">
                        <div className="font-semibold text-gray-800 text-center">Rut</div>
                        <div className="font-semibold text-gray-800 text-center">Nombre</div>
                        <div className="font-semibold text-gray-800 text-center">Categoría</div>
                        <div className='font-semibold text-gray-800 text-center'></div>
                      </div>
                    </div>

                    {/* Cuerpo de la tabla con scroll */}
                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                      {pacientes.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {pacientes.map((paciente) => (
                            <div key={paciente.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                              <div className="font-medium text-gray-900 text-center flex items-center justify-center">
                                {paciente.rut}
                              </div>
                              <div className="font-medium text-gray-900 text-center flex items-center justify-center">
                                {paciente.nombre}
                              </div>
                              <div className="flex items-center justify-center">
                                <select
                                  onChange={(e) =>
                                    actualizarCategoria(
                                      paciente,
                                      e.target.value,
                                    )
                                  }
                                  className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm hover:shadow-md w-full max-w-[140px]"
                                >
                                  <option value="">Selecciona categoría</option>
                                  <option className="text-center" value="C1">🔴 C1</option>
                                  <option className="text-center" value="C2">🟠 C2</option>
                                  <option className="text-center" value="C3">🟡 C3</option>
                                  <option className="text-center" value="C4">🟢 C4</option>
                                  <option className="text-center" value="C5">🔵 C5</option>
                                  <hr/>
                                  <option className='text-center' value="Cancelado">Cancelar atención</option>
                                </select>
                              </div>
                              <div className='flex items-center justify-center'>
                                <BoxModal nombre={paciente.nombre}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center p-12">
                          <div className="text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg font-medium">
                              No hay pacientes ingresados
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                              Los pacientes aparecerán aquí cuando se registren
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer opcional con contador */}
                    {pacientes.length > 0 && (
                      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
                        <p className="text-sm text-gray-600 text-center">
                          Total de pacientes: <span className="font-semibold text-gray-800">{pacientes.length}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-500">
            <p className="text-sm">Sistema de Categorización - Desarrollado por el area informatica CESFAM-ICP</p>
          </div>
        </div>
      </div>
    </>
  );
}
