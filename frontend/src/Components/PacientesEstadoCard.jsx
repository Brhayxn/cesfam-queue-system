import React from 'react';
import { Clock, Stethoscope, Eye, UserPlus, CheckCircle, Users, Activity, AlertCircle } from 'lucide-react';

export default function PacientesCard({estadosPacientes}) {

  // Configuración de iconos y colores por estado
  const estadoConfig = {
    "En espera": {
      icon: Clock,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      label: "En Espera"
    },
    "En atencion": {
      icon: Stethoscope,
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
      label: "En Atención"
    },
    "En observacion": {
      icon: Eye,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      label: "En Observación"
    },
    "Ingresado": {
      icon: UserPlus,
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-200",
      label: "Ingresado"
    },
    "Atendido": {
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      label: "Atendido"
    }
  };

  const totalPacientes = estadosPacientes.reduce((sum, item) => sum + item.cantidad, 0);

if (totalPacientes === 0) {
  return (
    <div className="bg-white p-2 w-full h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Estado de Pacientes</h3>
            <p className="text-xs text-gray-500">Total: {totalPacientes} pacientes</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Activity className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>

      {/* Puedes agregar un mensaje cuando no hay pacientes */}
      <div className="text-center text-sm text-gray-400 mt-4">
        No hay pacientes registrados actualmente.
      </div>
    </div>
  );
}


  return (
    <>
        {/* Versión Compacta - Card principal */}
      <div className="bg-white p-2 w-full h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Estado de Pacientes</h3>
              <p className="text-xs text-gray-500">Total: {totalPacientes} pacientes</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-2">
          
          {estadosPacientes.map((item, index) => {
            const config = estadoConfig[item.estado];
            const Icon = config.icon;
            
            return (
              <div key={index} className={`flex items-center justify-between p-2 rounded-md border ${config.borderColor} ${config.bgColor} bg-opacity-30`}>
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${config.textColor}`} />
                  <span className="text-xs font-medium text-gray-700">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-bold ${config.textColor}`}>
                    {item.cantidad}
                  </span>
                  {item.cantidad > 0 && (
                    <div className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 animate-pulse`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}