import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar, FileText, AlertCircle } from 'lucide-react';
import { TopDias, GraficoHoras } from './Graficos';
import { Home, Users, Menu, X, Clock, CheckCircle, BarChart4, CircleX } from 'lucide-react';


import apiClient from '../assets/apiClient';

export default function Reports() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reportType, setReportType] = useState('');
    const [singleDate, setSingleDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});
    const [modalData, setModalData] = useState(null);

    // Validaciones
    const validateForm = () => {
        const newErrors = {};

        if (!reportType) {
            newErrors.reportType = 'Debes seleccionar un tipo de reporte';
        }

        if (reportType === 'diario') {
            if (!singleDate) {
                newErrors.singleDate = 'La fecha es requerida';
            } else if (dayjs(singleDate).isAfter(dayjs())) {
                newErrors.singleDate = 'La fecha no puede ser futura';
            }
        }

        if (reportType === 'rango') {
            if (!startDate) {
                newErrors.startDate = 'La fecha inicial es requerida';
            }
            if (!endDate) {
                newErrors.endDate = 'La fecha final es requerida';
            }
            if (startDate && endDate) {
                if (dayjs(startDate).isAfter(dayjs(endDate))) {
                    newErrors.endDate = 'La fecha final debe ser posterior a la inicial';
                }
                if (dayjs(endDate).isAfter(dayjs())) {
                    newErrors.endDate = 'La fecha final no puede ser futura';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async () => {
        if (!validateForm()) return;


        try {
            const reportData = {
                ...(reportType === 'diario' && { fechaInicio: singleDate }),
                ...(reportType === 'rango' && {
                    fechaInicio: startDate,
                    fechaFin: endDate
                })
            };

            // Guardamos los datos para el modal
            const response = await apiClient.post('/api/reportes/rangoFecha', reportData);
            console.log(response.data)
            setModalData(response.data);
            setIsOpen(true)
        } catch (error) {
            console.error('Error al generar reporte:', error);
            alert('Error al generar el reporte. Intenta nuevamente.');
        }
    };

    // Limpiar errores cuando el usuario cambia valores
    const handleReportTypeChange = (e) => {
        const newType = e.target.value;
        setReportType(newType);
        setErrors({});

        // Limpiar fechas cuando cambia el tipo
        setSingleDate('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FileText className="text-blue-600 w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Generador de Reportes
                        </h2>
                        <p className="text-gray-600">
                            Selecciona el tipo de reporte y configura las fechas
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Selector de tipo de reporte */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Reporte
                            </label>
                            <select
                                value={reportType}
                                onChange={handleReportTypeChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.reportType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Selecciona un tipo de reporte</option>
                                <option value="diario">Reporte diario</option>
                                <option value="rango">Reporte por rango</option>
                            </select>
                            {errors.reportType && (
                                <div className="flex items-center mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.reportType}
                                </div>
                            )}
                        </div>

                        {/* Campos de fecha dinámicos */}
                        {reportType === 'diario' && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha del Reporte
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        value={singleDate}
                                        onChange={(e) => {
                                            setSingleDate(e.target.value);
                                            setErrors(prev => ({ ...prev, singleDate: '' }));
                                        }}
                                        max={dayjs().format('YYYY-MM-DD')}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.singleDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.singleDate && (
                                    <div className="flex items-center mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.singleDate}
                                    </div>
                                )}
                            </div>
                        )}

                        {reportType === 'rango' && (
                            <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha Inicial
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setErrors(prev => ({ ...prev, startDate: '' }));
                                            }}
                                            max={dayjs().format('YYYY-MM-DD')}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    {errors.startDate && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.startDate}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha Final
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                setErrors(prev => ({ ...prev, endDate: '' }));
                                            }}
                                            min={startDate || undefined}
                                            max={dayjs().format('YYYY-MM-DD')}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    {errors.endDate && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.endDate}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Botón de envío */}
                        <div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`
          w-full py-3 px-6 bg-blue-600 rounded-lg font-semibold text-white 
          transition-all duration-200 transform hover:scale-[1.02] 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
                                {isLoading ? 'Generando...' : 'Generar reporte'}
                            </button>

                            {/* Modal Mejorado */}
                            {isOpen && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
                                        {/* Header del Modal */}
                                        <div className="bg-blue-500 px-6 py-4 text-white">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-2xl font-bold flex items-center">
                                                    Resultado del Reporte
                                                </h2>
                                                <button
                                                    onClick={() => setIsOpen(false)}
                                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Contenido del Modal */}
                                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                            {reportType === "diario" && (
                                                <div className="space-y-6">
                                                    {/* Sección Principal - Top Días */}
                                                    <div className="bg-withe rounded-xl p-6 border shadow-lg">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center ">
                                                            Actividad por hora
                                                        </h3>
                                                        <div className="bg-white rounded-lg  p-6" style={{ minWidth :'10vh' }}>
                                                            <div className="flex items-center justify-center h-full">
                                                                <GraficoHoras data={modalData.actividad} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Sección de Estadísticas */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {/* Tarjeta - Tiempo Promedio */}
                                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-3 bg-blue-100 rounded-xl">
                                                                        <Clock className="h-6 w-6 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                                            Tiempo Promedio
                                                                        </p>
                                                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                                                            {modalData.promedio}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                           
                                                        </div>

                                                        {/* Tarjeta - Pacientes Atendidos */}
                                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-3 bg-green-100 rounded-xl">
                                                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                                            Pacientes Atendidos
                                                                        </p>
                                                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                                                            {modalData.atenciones}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                        
                                                            </div>
                                                        </div>

                                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-3 bg-red-100 rounded-xl">
                                                                        <CircleX className="h-6 w-6 text-red-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                                            Atenciones Canceladas
                                                                        </p>
                                                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                                                            {modalData.cancelados}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                           
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {reportType === "rango" && (
                                                <div className="space-y-6">
                                                    {/* Sección Principal - Top Días */}
                                                    <div className="bg-withe rounded-xl p-6 border shadow-lg">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center ">
                                                            Actividad diaria
                                                        </h3>
                                                        <div className="bg-white rounded-lg  p-6" style={{ minWidth :'10vh' }}>
                                                            <div className="flex items-center justify-center h-full">
                                                                <TopDias reporte={modalData.atencionesData} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Sección de Estadísticas */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {/* Tarjeta - Tiempo Promedio */}
                                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-3 bg-blue-100 rounded-xl">
                                                                        <Clock className="h-6 w-6 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                                            Tiempo Promedio
                                                                        </p>
                                                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                                                            {parseFloat(modalData.registros[0].promedioAtencion).toFixed(0)} minutos
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                           
                                                        </div>

                                                        {/* Tarjeta - Pacientes Atendidos */}
                                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-3 bg-green-100 rounded-xl">
                                                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                                            Pacientes Atendidos
                                                                        </p>
                                                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                                                            {modalData.registros[0].totalRegistros}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                        
                                                            </div>
                                                        </div>

                                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-3 bg-red-100 rounded-xl">
                                                                        <CircleX className="h-6 w-6 text-red-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                                            Atenciones Canceladas
                                                                        </p>
                                                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                                                            {modalData.registros[0].totalCancelados}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                           
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                            Información:
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Los reportes diarios muestran datos de un día específico</li>
                            <li>• Los reportes por rango abarcan múltiples días</li>
                            <li>• No se pueden seleccionar fechas futuras</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}