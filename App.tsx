import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FunnelStep, UserSession } from './types';
import { Experience0_Welcome } from './components/Experience0_Welcome';
import { Experience1_Call } from './components/Experience1_Call';
import { Experience2_Scanner } from './components/Experience2_Scanner';
import { Experience3_Quiz } from './components/Experience3_Quiz';
import { WhatsAppInterface } from './components/WhatsAppInterface';
import { Experience5_VSL } from './components/Experience5_VSL';
import { Experience6_InstaLogin } from './components/Experience6_InstaLogin';
import { Experience7_Feed } from './components/Experience7_Feed';
import { Experience9_SalesPage } from './components/Experience9_SalesPage';
import { AdminPanel } from './components/AdminPanel';
import { Settings, ChevronRight, X, BarChart3 } from 'lucide-react';
import { db } from './src/lib/firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

const App: React.FC = () => {
  const [step, setStep] = useState<FunnelStep>(FunnelStep.WELCOME);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(() => {
    return localStorage.getItem('vladimir_debug_mode') === 'true';
  });

  const sessionId = useRef<string>(Math.random().toString(36).substring(7));
  const startTime = useRef<number>(Date.now());
  const clickCount = useRef<number>(0);
  const lastClickTime = useRef<number>(0);

  // Listener Global de Clics
  useEffect(() => {
    const handleWindowClick = () => {
      const now = Date.now();
      if (now - lastClickTime.current > 1500) {
        clickCount.current = 0;
      }
      clickCount.current += 1;
      lastClickTime.current = now;

      if (clickCount.current >= 5) {
        setDebugEnabled(prev => {
          const newState = !prev;
          localStorage.setItem('vladimir_debug_mode', newState.toString());
          console.log(`%c [SYSTEM] Modo Debug ${newState ? 'ACTIVADO' : 'DESACTIVADO'} `, 'background: #222; color: #bada55; font-weight: bold;');
          return newState;
        });
        clickCount.current = 0;
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  // Verificar parámetros de URL y ruta
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    // 1. Manejar Modo Debug (parámetros explícitos)
    if (params.get('debug') === 'true' || params.get('admin') === 'true') {
      setDebugEnabled(true);
      localStorage.setItem('vladimir_debug_mode', 'true');
    } else if (params.get('debug') === 'false') {
      setDebugEnabled(false);
      localStorage.setItem('vladimir_debug_mode', 'false');
    }

    // 2. Manejar Navegación por Ruta (independiente del modo debug)
    if (path === '/adminpanel') {
      setStep(FunnelStep.ADMIN);
    }
  }, []);

  const trackStep = useCallback(async (newStep: FunnelStep) => {
    try {
      await setDoc(doc(db, "sessions", sessionId.current), {
        id: sessionId.current,
        startTime: startTime.current,
        lastActive: Date.now(),
        currentStep: newStep,
        deviceInfo: navigator.userAgent,
        stepsReached: arrayUnion(newStep)
      }, { merge: true });
    } catch (e) {
      console.error("Error saving session to Firestore:", e);
    }
  }, []);

  useEffect(() => {
    trackStep(step);
  }, [step, trackStep]);

  const nextStep = useCallback(() => {
    const steps = Object.values(FunnelStep).filter(s => s !== FunnelStep.ADMIN);
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }, [step]);

  const goToSales = useCallback(() => {
    setStep(FunnelStep.SALES_PAGE);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative selection:bg-red-500 selection:text-white">

      {/* DEV PANEL */}
      {debugEnabled && (
        <div className="fixed bottom-4 left-4 z-[9999] font-mono flex flex-col gap-2">
          <button
            onClick={() => setStep(FunnelStep.ADMIN)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-blue-500/50"
            title="Panel de Administración"
          >
            <BarChart3 size={20} />
          </button>

          {!showDevPanel ? (
            <button
              onClick={() => setShowDevPanel(true)}
              className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-red-500/50"
              title="Herramientas de Desarrollo"
            >
              <Settings size={20} />
            </button>
          ) : (
            <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-4 w-64 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Dev Tools</span>
                <button onClick={() => setShowDevPanel(false)} className="text-neutral-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {Object.values(FunnelStep).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStep(s);
                      setShowDevPanel(false);
                    }}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-colors ${step === s
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                      }`}
                  >
                    <span>{s}</span>
                    {step === s && <ChevronRight size={12} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDERIZADO DE EXPERIENCIAS */}
      <div className="h-full">
        {step === FunnelStep.WELCOME && <Experience0_Welcome onComplete={nextStep} onSkipToSales={goToSales} />}
        {step === FunnelStep.CALL && <Experience1_Call onComplete={nextStep} />}
        {step === FunnelStep.WHATSAPP_INTRO && (
          <WhatsAppInterface
            contactName="Camila"
            messages={["Hola.", "Te vi atento.", "Quiero mostrarte algo que nadie está viendo.", "Inicia el escaneo cuando estés listo."]}
            onComplete={nextStep}
            buttonLabel="Iniciar Escaneo"
          />
        )}
        {step === FunnelStep.SCANNER && <Experience2_Scanner onComplete={nextStep} />}
        {step === FunnelStep.QUIZ && <Experience3_Quiz onComplete={nextStep} />}
        {step === FunnelStep.WHATSAPP_AUTH && (
          <WhatsAppInterface
            contactName="Camila"
            messages={["Gracias por responder.", "No estás aquí por curiosidad.", "Estás aquí porque ya entendiste algo...", "Voy a habilitarte acceso a una transmisión cifrada."]}
            onComplete={nextStep}
            buttonLabel="Ver Transmisión Cifrada"
          />
        )}
        {step === FunnelStep.VSL && <Experience5_VSL onComplete={nextStep} />}
        {step === FunnelStep.WHATSAPP_CONTINUITY && (
          <WhatsAppInterface
            contactName="Camila"
            messages={["Ahora ya viste por qué el sistema no falló solo.", "Lo que sigue no es para convencerte.", "Es para que confirmes."]}
            onComplete={nextStep}
            buttonLabel="Acceder al Archivo Privado"
          />
        )}
        {step === FunnelStep.INSTA_LOGIN && <Experience6_InstaLogin onComplete={nextStep} />}
        {step === FunnelStep.FEED && <Experience7_Feed onComplete={nextStep} />}
        {step === FunnelStep.WHATSAPP_OBJECTIONS && (
          <WhatsAppInterface
            contactName="Camila"
            messages={["No necesitas creer en personas.", "Solo en mecanismos que se ejecutan.", "Vladimir está para tu bienestar."]}
            onComplete={nextStep}
            buttonLabel="Ver Plan de Ejecución Completo"
          />
        )}
        {step === FunnelStep.SALES_PAGE && <Experience9_SalesPage />}

        {/* ADMIN PANEL */}
        {step === FunnelStep.ADMIN && <AdminPanel onExit={() => setStep(FunnelStep.WELCOME)} />}
      </div>
    </div>
  );
};

export default App;
