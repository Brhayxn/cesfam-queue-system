import { useState } from "react";
import { Phone, User, MapPin, X } from "lucide-react";
import apiClient from '../../assets/apiClient';

export default function BoxModal({ nombre }) {
    const [isOpen, setIsOpen] = useState(false);

    const alertaPublica = async(nombre,box)=>{
        apiClient.post('/api/pacientes/llamar', {nombre:nombre, box:box} )
    }

    const handleBoxSelect = (boxNumber) => {
        /*const llamado = new SpeechSynthesisUtterance(`${nombre} porfavor dirigirse al box numero ${boxNumber}`);
        llamado.lang = 'es-ES';
        llamado.rate = 0.8
        window.speechSynthesis.speak(llamado);*/
        setIsOpen(false);
        alertaPublica(nombre,boxNumber)
    };
        function beep(frequency = 325, duration = 500) {
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const gain = context.createGain();
    
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
    
            oscillator.connect(gain);
            gain.connect(context.destination);
    
            oscillator.start();
            oscillator.stop(context.currentTime + duration / 1000);
        }

    return (
        <div className="">
            {/* Botón para abrir modal */}
            <button
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-400/20"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex items-center gap-2">
                    <Phone size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Llamar</span>
                </div>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen overflow-hidden">
                    <div
                        data-aos="fade-left"
                        className="bg-white rounded-xl mb-48 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Llamar Paciente</h2>
                                        <p className="text-blue-100 text-sm font-medium">{nombre}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                                    aria-label="Cerrar modal"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                            <div className="mb-6 text-center">
                                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                                    <MapPin size={16} />
                                    Seleccione el box de atención
                                </div>
                            </div>

                            {/* Grid de boxes */}
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6, "Triage"].map((boxNumber) => (
                                    <button
                                        key={boxNumber}
                                        onClick={() => handleBoxSelect(boxNumber)}
                                        className="
                                            relative group p-3 rounded-lg font-medium text-sm transition-all duration-300 transform 
                                            focus:outline-none focus:ring-2 focus:ring-blue-400/30
                                            bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-500 hover:to-blue-600 
                                            text-blue-700 hover:text-white border border-blue-200 hover:border-blue-500 
                                            hover:scale-105 hover:shadow-md
                                        "
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <div
                                                className="
                                                    py-2 px-2 rounded-md flex items-center justify-center text-xs font-bold 
                                                    bg-blue-200 text-blue-700 group-hover:bg-white/20 group-hover:text-white
                                                    transition-colors duration-300
                                                "
                                            >
                                                {boxNumber}
                                            </div>
                                            <span className="text-xs">Box {boxNumber}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}