import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Users, Clock } from "lucide-react";
import apiClient from "../assets/apiClient";
import socket from "../assets/ioClient";
import { useNavigate } from "react-router-dom";
import BoxModal from "./modals/BoxModal";
import useVerify from "../.hooks/verifySession";
import Swal from "sweetalert2";

// Configurar el socket

export default function PacientesLista() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acciones, setAcciones] = useState(false);
  const [tiempoAhora, setTiempoAhora] = useState(dayjs()); // Estado que se actualiza cada minuto
  const navigate = useNavigate();

  useVerify("medico");

  const getPacientes = async () => {
    const url = "/api/pacientes/estado?state=General";
    //
    apiClient
      .get(url)
      .then((res) => {
        setPacientes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPacientes();
  }, []);

  useEffect(() => {
    // Escuchar nuevo paciente
    const handlePacienteNuevo = (nuevoPaciente) => {
      const paciente = nuevoPaciente

      if(paciente.estado === "Ingresado"){
        return
      }else{
        setPacientes((prevPacientes) => [...prevPacientes, paciente]);
      }
    };

    // Escuchar actualización
    const handleActualizacionPaciente = (pacienteActualizado) => {
      const verify = verificarAcciones()
      if (!verify) {
        setAcciones(verify)
      }
      setPacientes((prevPacientes) =>
        prevPacientes.map((p) =>
          p.id === pacienteActualizado.id ? pacienteActualizado : p
        )
      );
    };

    socket.on("pacienteNuevo", handlePacienteNuevo);
    socket.on("actualizacionPaciente", handleActualizacionPaciente);

    // Limpieza de sockets
    return () => {
      socket.off("pacienteNuevo");
      socket.off("actualizacionPaciente");
    };
  }, []);

  // Actualizar la hora actual cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoAhora(dayjs());
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, []);

  /* Estado de carga con spinner animado
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando pacientes...</p>
          <p className="text-sm text-gray-500 mt-2">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  // Estado de error con icono y mejor diseño
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar los datos</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors duration-200"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }*/

  const getHora = (fechaISO) => {
    return dayjs(fechaISO).format("HH:mm");
  };

  const TiempoTranscurrido = (fechaLlegada) => {
    const llegada = dayjs(fechaLlegada);
    const totalMinutos = tiempoAhora.diff(llegada, "minute");
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    if (horas === 0) return `${minutos} minutos`;

    return `${horas} hora${horas !== 1 ? "s" : ""} ${minutos} minuto${
      minutos !== 1 ? "s" : ""
    }`;
  };

  const actualizarEstado = async (paciente, nuevoEstado) => {
    if (nuevoEstado === "Cancelado") {
      try {
        Swal.fire({
          title: `Cancelar atencion a \n${paciente.nombre}\n Rut: ${paciente.rut}`,
          showDenyButton: true,
          confirmButtonText: "Aceptar",
          denyButtonText: `Cancelar`,
          icon: "info",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire(
              "Cancelacion exitosa!",
              "Se registro la cancelacion de atencion.",
              "success"
            );
            try {
              await apiClient.put(`/api/pacientes/${paciente.id}`, {
                estado: nuevoEstado,
              });
              setPacientes((prevPacientes) =>
                prevPacientes.filter((p) => p.id !== paciente.id)
              );

            } catch (error) {
              console.error("Error al actualizar estado:", error);
            }
          } else if (result.isDenied) {
            Swal.fire(
              "Proceso cancelado",
              "No se registro la cancelacion de la atencion.",
              "info"
            );
          }
        });
      } catch (error) {
        console.error("Error al comunicarse con el servidor", error);
      }
    } else if(nuevoEstado === 'Atendido'){
      try {
        await apiClient.put(`/api/pacientes/${paciente.id}`, {
          estado: nuevoEstado,
        });
        setPacientes((prevPacientes) =>
          prevPacientes.filter((p) => p.id !== paciente.id)
        );
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }
    } else {
      try {
        await apiClient.put(`/api/pacientes/${paciente.id}`, {
          estado: nuevoEstado,
        });
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }
    }
  };

  const verificarAcciones = ()=>{
    return pacientes.some(p => p.estado === "En espera")
  }

  return (
    <>
      <div className="flex justify-center w-screen mt-10">
        <div
          data-aos="fade-left"
          className="w-[55vw] p-6 bg-white shadow-md rounded-lg"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Pacientes en espera
              </h1>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-300 mt-3">
            <table className="min-w-full table-auto  rounded-xl">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Hora de ingreso</th>
                  <th className="px-4 py-2">Tiempo transcurrido</th>
                  {acciones ? (
                    <th></th>
                  ) : (
                    <th></th>
                  )}
                  
                </tr>
              </thead>
              <tbody>
                {pacientes?.length > 0 ? (
                  pacientes.map((paciente) => (
                    <tr
                      key={paciente.id}
                      className="border-b hover:bg-gray-50 transition text-center"
                    >
                      <td className="px-4 py-2 font-medium">
                        {paciente.nombre}
                      </td>
                      <td className="px-4 py-4 flex justify-center items-center">
                        <div
                          className={`text-xl text-white font-bold w-10 h-10 flex items-center justify-center rounded-full ${
                            paciente.categoria === "C1"
                              ? "bg-red-500"
                              : paciente.categoria === "C2"
                              ? "bg-yellow-500"
                              : paciente.categoria === "C3"
                              ? "bg-yellow-300"
                              : paciente.categoria === "C4"
                              ? "bg-green-500"
                              : paciente.categoria === "C5"
                              ? "bg-blue-500"
                              : ""
                          }`}
                        >
                          {paciente.categoria}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className={`text-sm font-medium px-3 py-1 rounded-lg shadow-sm border outline-none transition-colors duration-200
                    ${
                      paciente.estado === "En espera"
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : paciente.estado === "En atencion"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : paciente.estado === "En observacion"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : "bg-green-100 text-green-800 border-green-300"
                    }
                  `}
                          value={paciente.estado}
                          onChange={(e) =>
                            actualizarEstado(paciente, e.target.value)
                          }
                        >
                          <option value="En espera">En espera</option>
                          <option value="En atencion">En atención</option>
                          <option value="En observacion">En observación</option>
                          <option value="Atendido">Atendido</option>
                          <hr />
                          <option value="Cancelado">Cancelar atencion</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {getHora(paciente.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        {TiempoTranscurrido(paciente.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        {paciente.estado === "En espera" ? (
                          <div className="flex space-between-2">
                            <BoxModal nombre={paciente.nombre} />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="bg-gray-50 p-12 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">
                        No hay pacientes ingresados
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
