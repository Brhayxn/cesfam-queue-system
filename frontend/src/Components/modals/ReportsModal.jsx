import { useState, useEffect } from "react";
import { TopDias, GraficoHoras } from '../Graficos';
import { Home, Users, Menu, X , Clock, CheckCircle, BarChart4} from 'lucide-react';

export default function ReporteModal({ handleGenerateReport, reportData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reportResult, setReportResult] = useState(null);
    const [typeResult, setTypeResult] = useState(null);

    const handleOpenModal = async () => {
        setIsLoading(true);
        try {
            // Ejecutamos la función del padre
            const result = await handleGenerateReport();

            if (result) {
                setTypeResult(reportData.tipo)
                setReportResult(reportData.data);
                
                setIsOpen(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }

        console.log(repor);
        

        
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleOpenModal}
                disabled={isLoading}
                className={`
          w-full py-3 px-6 bg-blue-600 rounded-lg font-semibold text-white 
          transition-all duration-200 transform hover:scale-[1.02] 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
                {isLoading ? 'Generando...' : 'Generar reporte'}
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">Resultado del Reporte</h2>

                        {typeResult === "diario" && (
                            <div>
                                {JSON.stringify(reportResult)}
                            </div>
                        )}

                        {typeResult === "rango" && (
                            <div>
                                <div className="flex-1 bg-white rounded-lg shadow-md p-4 border border-gray-200" style={{ height: '50vh' }}>
                                    <div className="flex items-center justify-center h-full text-4xl font-bold text-blue-600 "><TopDias reporte={reportResult.atencionesData} /></div>
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
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}