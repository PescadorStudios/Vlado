import React, { useState, useEffect } from 'react';
import { Play, X, User, Phone as PhoneIcon, ArrowRight } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const VIDEO_URL = "https://res.cloudinary.com/deirdgemo/video/upload/v1772307909/copy_C1FE1742-EA8A-41A3-A265-0CE658149D8A_p0xcpj.mov";

export const BienestarLanding: React.FC = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [referrerId, setReferrerId] = useState<string | null>(null);

    useEffect(() => {
        // Extraer ID de referido de la URL si existe
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            setReferrerId(ref);
        }
    }, []);

    const handleOpenVideo = () => setIsVideoOpen(true);
    const handleOpenForm = () => setIsModalOpen(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;

        setIsSubmitting(true);

        try {
            // Clean phone number
            const cleanPhone = formData.phone.replace(/\D/g, '');

            // Check if user already exists
            const usersRef = collection(db, "bienestar_users");
            const q = query(usersRef, where("phone", "==", cleanPhone));
            const querySnapshot = await getDocs(q);

            let userId = "";

            if (!querySnapshot.empty) {
                // User exists, just log them in
                userId = querySnapshot.docs[0].id;
            } else {
                // Create new user
                const newUser = {
                    name: formData.name,
                    phone: cleanPhone,
                    timestamp: Date.now(),
                    referredBy: referrerId || null
                };
                const docRef = await addDoc(usersRef, newUser);
                userId = docRef.id;
            }

            // Redirigir al dashboard de login pasándole su teléfono como auth rudimentaria
            // o redirigirlo directo a su dashboard si ya lo creamos
            window.location.href = `/bienestarytecnologia/login?phone=${cleanPhone}`;

        } catch (error) {
            console.error("Error registering user: ", error);
            alert("Hubo un error al registrarte. Intenta de nuevo.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 selection:bg-blue-600 selection:text-white font-sans text-neutral-900">

            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* HERO BANNER */}
                <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 mb-8">
                    <img
                        src="https://res.cloudinary.com/deirdgemo/image/upload/v1772314272/Repeat_this_image_202602121513_rck5a6.jpg"
                        alt="Hero Banner Antioquia"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* TÍTULO PRINCIPAL DE ALTO IMPACTO */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-neutral-900">
                    Antioquia necesita un <span className="text-red-600">upgrade urgente</span> en su sistema de salud
                </h1>

                {/* VIDEOPLAYER GIGANTE */}
                <div className="relative group mx-auto max-w-2xl cursor-pointer" onClick={handleOpenVideo}>
                    <div className="absolute -inset-4 bg-red-600/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative aspect-video bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-800/50 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-[1.02]">
                        {/* Thumbnail o fondo oscuro */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 to-black/60 opacity-80" />

                        {/* Botón Play animado */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] animate-pulse">
                            <Play className="w-10 h-10 md:w-14 md:h-14 text-red-600 ml-2" fill="currentColor" />
                        </div>

                        <p className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm font-bold uppercase tracking-widest">
                            Presiona para reproducir
                        </p>
                    </div>
                </div>

                {/* CTA Y TEXTO */}
                <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-600 to-red-800" />

                    <p className="text-lg md:text-xl font-medium text-neutral-600 leading-relaxed">
                        Inscríbete, recibe tu link único y ayúdanos a promover esta iniciativa para ser de los primeros beneficiados del programa de bienestar.
                    </p>

                    <button
                        onClick={handleOpenForm}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xl md:text-2xl uppercase tracking-tighter py-6 px-8 rounded-2xl transition-all shadow-[0_10px_40px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_50px_rgba(220,38,38,0.6)] flex items-center justify-center gap-4 active:scale-[0.98]"
                    >
                        INSCRIBIRME Y RECIBIR MI LINK ÚNICO
                        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 animate-bounce-x" />
                    </button>
                </div>

            </div>

            {/* FULLSCREEN VIDEO MODAL */}
            {isVideoOpen && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                    <button
                        onClick={() => setIsVideoOpen(false)}
                        className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <video
                        src={VIDEO_URL}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        controlsList="nodownload"
                        playsInline
                    />
                </div>
            )}

            {/* REGISTRATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

                    <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 font-sans">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full p-2 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8 space-y-2 mt-2">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-red-600">Registro de Bienestar</h3>
                            <p className="text-neutral-500 text-sm font-medium">Ingresa tus datos para obtener tu link de embajador.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nombre Completo"
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 pl-12 pr-4 text-neutral-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium placeholder-neutral-400"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="Tu número de celular"
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 pl-12 pr-4 text-neutral-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium placeholder-neutral-400"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>COMENZAR AHORA <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Style for bounce-x animation if not present in tailwind config */}
            <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25%); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
        </div>
    );
};
