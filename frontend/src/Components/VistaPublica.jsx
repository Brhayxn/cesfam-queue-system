import { useState, useEffect } from "react";
import { Clock, Users, UserCheck } from "lucide-react";
import socket from "../assets/ioClient";
import apiClient from "../assets/apiClient";
import foto from "../assets/logoCesfam2.png";
import Swal from "sweetalert2";
import AlertModal from "./modals/AlertModal";
import beepMp3 from "../assets/beep.mp3"

export default function ListaPublica() {
  const [pacientesEspera, setPacientesEspera] = useState([]);
  const [pacientesEnAtencion, setPacientesAtencion] = useState([]);
  const [tiempoAhora, setTiempoAhora] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const getPacientesEspera = async () => {
    const url = "/api/pacientes/estado?state=En espera";
    apiClient
      .get(url)
      .then((res) => {
        setPacientesEspera(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const getPacientesEnAtencion = async () => {
    const url = "/api/pacientes/estado?state=Publico";
    apiClient
      .get(url)
      .then((res) => {
        setPacientesAtencion(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    const iniciar = async () => {
      //await autorizar(); // Esperar que se autorice primero
      await getPacientesEspera();
      await getPacientesEnAtencion();
    };
    iniciar(); // Llama a la función async dentro del useEffect
  }, []);

  useEffect(() => {
    // Escuchar eventos de socket
    socket.on("pacienteNuevo", (nuevoPaciente) => {
      const paciente = nuevoPaciente
      console.log(paciente);

      if(paciente.estado === "Ingresado"){
        return
      }else{
        setPacientesEspera((prevPacientes) => [...prevPacientes, paciente]);
      }
    });

    socket.on("actualizacionPaciente", (pacienteActualizado) => {
      // Manejar actualización de paciente moviéndolo entre arrays según su estado

      if (pacienteActualizado.estado === "En espera") {
        // Agregar a espera y remover de atención si estaba allí
        setPacientesEspera((prev) => {
          // Evitar duplicados
          const existe = prev.some((p) => p.id === pacienteActualizado.id);
          if (!existe) {
            return [...prev, pacienteActualizado];
          }
          // Si ya existe, actualizarlo
          return prev.map((p) =>
            p.id === pacienteActualizado.id ? pacienteActualizado : p
          );
        });

        // Remover de atención
        setPacientesAtencion((prev) =>
          prev.filter((p) => p.id !== pacienteActualizado.id)
        );
      } else if (
        pacienteActualizado.estado === "En atencion" ||
        pacienteActualizado.estado === "En observacion"
      ) {
        // Agregar a atención y remover de espera si estaba allí
        setPacientesAtencion((prev) => {
          // Evitar duplicados
          const existe = prev.some((p) => p.id === pacienteActualizado.id);
          if (!existe) {
            return [...prev, pacienteActualizado];
          }
          // Si ya existe, actualizarlo
          return prev.map((p) =>
            p.id === pacienteActualizado.id ? pacienteActualizado : p
          );
        });

        // Remover de espera
        setPacientesEspera((prev) =>
          prev.filter((p) => p.id !== pacienteActualizado.id)
        );
      } else if (
        pacienteActualizado.estado === "Atendido" ||
        pacienteActualizado.estado === "Cancelado"
      ) {
        // Actualizar ambos arrays filtrando el paciente
        setPacientesEspera((prev) =>
          prev.filter((p) => p.id !== pacienteActualizado.id)
        );

        setPacientesAtencion((prev) =>
          prev.filter((p) => p.id !== pacienteActualizado.id)
        );
      }
    });
    socket.on("llamadoPaciente", (data) => {
        const patientName = data.nombre;
        const patientBox = data.box;
        beep()
        console.log(`call recived`);
        const text = `${patientName}\n ingresar al Box ${patientBox}`;
        setAlertMessage(text);
        setShowModal(true);
    });

    return () => {
      socket.off("pacienteNuevo");
      socket.off("actualizacionPaciente");
      socket.off("llamadoPaciente");
    };
  }, []);

  // ✅ Correcto
  const beep = () => {
    const audio = new Audio(beepMp3);
    audio.play().catch((error) => {
      console.error("Error reproduciendo beep:", error);
    });
  };

  const getHora = (fechaISO) => {
    return new Date(fechaISO).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estadoLabels = {
    "En espera": "En espera",
    "En atencion": "En atención",
    "En observacion": "En observación",
    Atendido: "Atendido",
  };

  const reducirNombre = (nombre) => {
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 0) return "";

    const inicial = partes[0][0];
    const apellido = partes.length > 1 ? partes[1] : "";

    return apellido ? `${inicial}. ${apellido}` : inicial;
  };

  const PatientCard = ({ paciente, showWaitTime = false }) => (
    <div className={`${paciente.estado === "En observacion" ? "bg-yellow-100" : "bg-white"} rounded-2xl p-3 border border-gray-100 shadow-md`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-2xl">
          {reducirNombre(paciente.nombre)}
        </h3>
        <div className="flex items-center text-gray-700 text-sm">
          <Clock className="w-7 h-7 mr-1" />
          {getHora(paciente.createdAt)}
        </div>
        <span
          className={`text-sm font-medium rounded-full p-2 border inline-block w-auto text-center whitespace-nowrap
                        ${
                          paciente.estado === "En espera"
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : paciente.estado === "En atencion"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : paciente.estado === "En observacion"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                            : paciente.estado === "Atendido"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                    `}
        >
          {estadoLabels[paciente.estado]}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 ">
        <div className="fixed top-4 left-4 z-50">
          <img src={foto} alt="Logo Cesfam" style={{ width: "8vw" }} />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 to-green-500 bg-clip-text text-transparent mb-4 tracking-tight">
              Sala de Espera
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-700 to-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-2">
                  En Espera
                </p>
                <p className="text-6xl font-bold text-blue-600">
                  {pacientesEspera.length}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-2">
                  En Atención
                </p>
                <p className="text-6xl font-bold text-green-600">
                  {pacientesEnAtencion.length}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-2xl">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pacientes en Espera */}
          
          <div className="space-y-6">
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">En Espera</h2>
            </div>

            <div className="space-y-4">
              {pacientesEspera.length > 0 ? (
                pacientesEspera.map((paciente) => (
                  <PatientCard
                    key={paciente.id}
                    paciente={paciente}
                    showWaitTime={true}
                  />
                ))
              ) : (
                <div className="bg-gray-50 rounded-2xl p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No hay pacientes en espera
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pacientes en Atención */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">En Atención</h2>
            </div>

            <div className="space-y-4">
              {pacientesEnAtencion.length > 0 ? (
                pacientesEnAtencion.map((paciente) => (
                  <PatientCard key={paciente.id} paciente={paciente} />
                ))
              ) : (
                <div className="bg-gray-50 rounded-2xl p-12 text-center">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Nadie en atención</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      <audio src={beepMp3} preload="true" autoPlay={false} autostart="false" style={{ display: "none" }} />
    </div>
  );
}
