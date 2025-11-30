import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Users, Clock } from 'lucide-react';
import apiClient from '../assets/apiClient';
import socket from '../assets/ioClient';
import { useNavigate } from 'react-router-dom';
import useVerify from '../.hooks/verifySession';

export default function AtendidosLista() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiempoAhora, setTiempoAhora] = useState(dayjs()); // Estado que se actualiza cada minuto
  const navigate = useNavigate();
  useVerify('medico')

  const getPacientes = async() =>{
    const url = '/api/pacientes/estado?state=Atendido';
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
          console.log("puntoactualizado")
          getPacientes()
      });

    // Limpieza de sockets
    return () => {
      socket.off("pacienteNuevo");
      socket.off("actualizacionPaciente");
    };
  }, []);

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoAhora(dayjs());
    }, 10000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getHora = (fechaISO) => {
    return dayjs(fechaISO).format('HH:mm');
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await apiClient.put(`/api/pacientes/${id}`, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  return (
    <div
      data-aos="fade-left"
      className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Pacientes atendidos
          </h1>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <h2 className="text-lg font-medium">Últimas 2 horas</h2>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-300 mt-3">
        <table className="min-w-full table-auto rounded-xl">
          <thead>
            <tr className="bg-blue-100 ">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Hora de ingreso</th>
              <th className="px-4 py-2">Hora de salida</th>
            </tr>
          </thead>
          <tbody>
            {pacientes?.length > 0 ? (
              pacientes.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="border-b hover:bg-gray-50 transition text-center"
                >
                  <td className="px-4 py-2 font-medium">{paciente.nombre}</td>
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
                        actualizarEstado(paciente.id, e.target.value)
                      }
                    >
                      <option value="En espera">En espera</option>
                      <option value="En atencion">En atención</option>
                      <option value="En observacion">En observación</option>
                      <option value="Atendido">Atendido</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">{getHora(paciente.createdAt)}</td>
                  <td className="px-4 py-2">{getHora(paciente.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="bg-gray-50 p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    No se han atendido pacientes
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
