import React, { useState, useEffect } from 'react';
import { Shield, Target, Activity, CheckCircle, HelpCircle, ArrowRight, X, User, Phone as PhoneIcon, Users } from 'lucide-react';
import { Lead } from '../types';
import { db } from '../src/lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

// LINK DE WHATSAPP REAL PROPORCIONADO
const WHATSAPP_LINK = "https://chat.whatsapp.com/Iw5BGzTwmAx7syn2VMe0wp";

export const Experience9_SalesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  // Cargar leads para prueba social en tiempo real desde Firestore
  useEffect(() => {
    const q = query(
      collection(db, "leads"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      setRecentLeads(leads);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenForm = () => setIsModalOpen(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    console.log("Iniciando envío de formulario...", formData);

    try {
      const newLead = {
        name: formData.name,
        phone: formData.phone,
        timestamp: Date.now()
      };

      // Race condition: Firestore write vs 10s timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tiempo de espera agotado. Verifica tu conexión o la configuración de Firebase.")), 10000)
      );

      await Promise.race([
        addDoc(collection(db, "leads"), newLead),
        timeoutPromise
      ]);

      console.log("Documento guardado con éxito");

      // Redirigir a WhatsApp tras un breve delay
      setTimeout(() => {
        window.open(WHATSAPP_LINK, '_blank');
        setIsSubmitting(false);
        setIsModalOpen(false);
        setFormData({ name: '', phone: '' });
      }, 1200);

    } catch (error) {
      console.error("Error adding lead: ", error);
      alert("Hubo un error al guardar. Verifica la consola para más detalles.\nPosible causa: Base de datos no creada o reglas de seguridad bloqueantes.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-600 selection:text-white pb-24">

      {/* 1. HEADLINE */}
      <section className="bg-red-600 text-white pt-24 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 mb-4">
            <Activity size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Ejecución Inmediata</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] break-words">
            El problema nunca fue la ley. <br />
            <span className="text-blue-900">Fue que nadie la ejecutó.</span>
          </h1>
        </div>
      </section>

      {/* 2. APERTURA DRAMÁTICA */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-800">El país no está sin normas. Está sin responsables.</h2>
        <div className="space-y-6 text-lg md:text-xl text-neutral-600 leading-relaxed font-medium">
          <p>Mientras discutimos promesas, los derechos quedan archivados.</p>
          <p>Mientras se debaten discursos, la salud no llega, la salud mental no existe, y el bienestar se posterga.</p>
        </div>
      </section>

      {/* 3. PRUEBA SOCIAL (INSCRITOS RECIENTES) */}
      <section className="py-12 bg-neutral-50 border-y border-neutral-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
            <Users className="text-red-600" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Inscripciones en tiempo real</h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs uppercase italic">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-800">{lead.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">Activado ahora</span>
                </div>
              </div>
            )) : (
              <div className="text-neutral-400 text-sm italic py-4">Esperando nuevas activaciones...</div>
            )}
          </div>
        </div>
      </section>

      {/* 5. EL MECANISMO */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-900">El Mecanismo</h2>
            <p className="text-lg text-neutral-600">Aquí no hay promesas futuras. Hay ejecución presente.</p>
            <div className="p-8 bg-neutral-100 rounded-3xl border-l-8 border-red-600">
              <p className="text-xl font-bold italic leading-tight">"Cuando alguien identifica la ley, la reglamenta, la fiscaliza y responde por su cumplimiento, el sistema deja de fallar."</p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { icon: <Target className="text-red-600" />, title: "Identificar", text: "Leyes de bienestar que no se cumplen." },
              { icon: <Activity className="text-red-600" />, title: "Activar", text: "Reglamentación real y efectiva." },
              { icon: <Shield className="text-red-600" />, title: "Fiscalizar", text: "Resultados visibles o no cuenta." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                <div className="shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-neutral-900">{item.title}</h4>
                  <p className="text-sm text-neutral-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. OFERTA POLÍTICA */}
      <section className="py-24 bg-red-600 text-white px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tighter">Esta es la oferta clara</h2>
          <div className="grid gap-6">
            {[
              "Hacer cumplir las leyes de bienestar ya aprobadas, no crear nuevas promesas.",
              "Ejecutar la Ley de Salud Mental, llevando psicólogos y profesionales a barrios y colegios.",
              "Fiscalizar el sistema de salud para que el derecho no se pierda en trámites.",
              "Dignificar a médicos, psicólogos y cuidadores, porque no hay salud sin quienes la sostienen.",
              "Convertir el bienestar en realidad cotidiana, no en discurso electoral."
            ].map((offer, i) => (
              <div key={i} className="flex items-start gap-4 text-xl md:text-2xl font-bold border-b border-white/20 pb-6">
                <CheckCircle className="shrink-0 mt-1" />
                <span>{offer}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl font-black uppercase text-center text-neutral-900 tracking-tight">Preguntas Frecuentes</h2>
          <div className="space-y-8">
            {[
              { q: "¿Esto es otra campaña más?", a: "No. Es una misión de cumplimiento." },
              { q: "¿Qué lo hace diferente?", a: "No promete crear leyes. Promete hacer cumplir las que ya existen." },
              { q: "¿Y si falla?", a: "El sistema falla cuando nadie ejecuta. No cuando alguien responde con hechos." }
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2 text-red-600 font-bold uppercase text-xs">
                  <HelpCircle size={14} /> <span>FAQ {i + 1}</span>
                </div>
                <h4 className="text-xl font-bold text-neutral-900">{faq.q}</h4>
                <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="py-32 px-6 bg-neutral-950 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="space-y-2">
            <p className="text-red-600 font-bold tracking-widest uppercase">Último Paso</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Activa. Ejecuta. Participa.</h2>
          </div>

          <div className="space-y-6 text-xl text-neutral-400">
            <p>Si también estás cansado de promesas...</p>
            <p>si ya no crees en discursos...</p>
            <p>si sabes que el problema no es la ley, sino su abandono...</p>
          </div>

          <button
            onClick={handleOpenForm}
            className="group w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-black text-2xl uppercase tracking-tighter py-6 px-12 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto active:scale-95"
          >
            Entrar a la comunidad
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>

          <p className="text-sm text-neutral-600 italic">No mires más debates. No esperes otro slogan.</p>
        </div>
      </section>

      {/* Mobile Footer Sticky */}
      <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden">
        <button
          onClick={handleOpenForm}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(29,78,216,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Ejecución Ahora <ArrowRight size={20} />
        </button>
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8 space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">Registro de Ejecución</h3>
              <p className="text-neutral-400 text-sm">Completa tus datos para unirte a la red oficial en WhatsApp.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Nombre Completo"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-red-600 outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    required
                    type="tel"
                    placeholder="Tu número de teléfono"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-red-600 outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-lg uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Activar Acceso <ArrowRight size={20} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-[10px] text-center text-neutral-600 uppercase tracking-widest font-bold">
              Una vez registrado serás redirigido al grupo oficial
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
