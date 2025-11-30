import { useState, useEffect } from "react";
import apiClient from "../../assets/apiClient";
import LogoutButton from '../LogoutButton';
import { data, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import foto from "../../assets/logoCesfam2.png"
import useVerify from "../../.hooks/verifySession";
import validarRUT from "../../.hooks/verifyRut";


export default function IngresoUrgencia({ }) {
    const [rut, setRut] = useState("");
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()


    useVerify('medico')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rut.trim() || !nombre.trim()) return;
        if (!(validarRUT(rut))) {
            Swal.fire({
                icon: 'info',
                title: 'El rut no cumple con formato valido'
            })
            return
        }

        let data = {
            "rut": rut,
            "nombre": nombre,
            "categoria": categoria,
            "estado": "En espera",
            "createdAt": new Date()
        }

        setIsSubmitting(true);
        try {
            apiClient.post("/api/pacientes", data).
                then(res => {
                    Swal.fire("Excelente!", "El paciente ha sido registrado con exito.", "success");
                })
                .catch(err => {
                    console.error(err.message);
                });
            setRut("");
            setNombre("");
            navigate('/pacientes')
        } catch (error) {
            console.error('Error al ingresar paciente:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = rut.trim() && nombre.trim() && categoria.trim();

    return (
        <>
            <LogoutButton />
            
            <div className="min-h-screen  flex flex-col items-center justify-center p-4">
                {/* Botón de logout flotante */}
                

                <div className="w-full max-w-6xl mx-auto">
                    <div data-aos='fade-right' className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

                            {/* Sección izquierda - Logo e información */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                                {/* Elementos decorativos de fondo */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-12 translate-y-12"></div>

                                <div className="relative z-10 text-center">
                                    {/* Logo placeholder - reemplaza con tu imagen */}
                                    <div className="w-48 h-48  bg-white/20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
                                        <img src={foto} alt="logo" />
                                    </div>

                                    <h1 className="text-4xl font-bold mb-1">CESFAM</h1>
                                    <h3 className="text-2xl font-semibold mb-6">Yerbas Buenas</h3>


                                    <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-semibold text-lg mb-2">Información importante</h4>
                                                <p className="text-white/90 leading-relaxed">
                                                    Asegúrate de que el RUT esté correctamente formateado (12.345.678-9) y que el nombre y apellido esten correctamente escritos.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección derecha - Formulario */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="max-w-md mx-auto w-full">
                                    {/* Header del formulario */}
                                    <div className="text-center mb-8">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro de Paciente</h2>
                                        <p className="text-gray-600">Ingresa los datos del paciente</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Campo RUT */}
                                        <div className="space-y-2">
                                            <label htmlFor="rut" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m4-2v2" />
                                                </svg>
                                                RUT del Paciente
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    id="rut"
                                                    value={rut}
                                                    onChange={(e) => setRut(e.target.value)}
                                                    placeholder="12.345.678-9"
                                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-900 group-hover:border-blue-300"
                                                    disabled={isSubmitting}
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campo Nombre */}
                                        <div className="space-y-2">
                                            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Nombre y apellidos
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    id="nombre"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    placeholder="Juan Pérez González"
                                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-900 group-hover:border-blue-300"
                                                    disabled={isSubmitting}
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/*Categorizar (solo medico)*/}

                                        <div className="space-y-2">
                                            <label htmlFor="categoria" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                                Categoría del Paciente
                                            </label>

                                            <div className="relative group">
                                                <select
                                                    id="categoria"
                                                    value={categoria}
                                                    onChange={(e) => setCategoria(e.target.value)}
                                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 group-hover:border-blue-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="">Selecciona categoría</option>
                                                    <option className="text-center" value="C1">🔴 C1</option>
                                                    <option className="text-center" value="C2">🟠 C2</option>
                                                    <option className="text-center" value="C3">🟡 C3</option>
                                                    <option className="text-center" value="C4">🟢 C4</option>
                                                    <option className="text-center" value="C5">🔵 C5</option>
                                                </select>

                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Botón de envío */}
                                        <div className="pt-4">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!isFormValid || isSubmitting}
                                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${isFormValid && !isSubmitting
                                                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transform hover:scale-[1.02] hover:-translate-y-0.5 shadow-xl hover:shadow-2xl'
                                                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                        <span>Registrando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        <span>Registrar Paciente</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 text-gray-500">
                        <p className="text-sm">Sistema de Registro - Desarrollado por el area informatica CESFAM-ICP</p>
                    </div>
                </div>
            </div>
        </>
    );
}