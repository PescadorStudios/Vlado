
import React, { useState, useEffect, useRef } from 'react';
import { Play, Activity, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onSkipToSales: () => void;
}

export const Experience0_Welcome: React.FC<Props> = ({ onComplete, onSkipToSales }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setIsPlaying(true);
    // Pequeño timeout para asegurar que el DOM del video esté listo si no lo estaba
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(err => {
          console.error("Error al reproducir video con audio:", err);
          // Re-intento si falla (algunas versiones de iOS son caprichosas)
          videoRef.current?.play();
        });
      }
    }, 50);
  };

  useEffect(() => {
    if (videoFinished) {
      const timers = [
        setTimeout(() => setIntroStep(1), 2000),
        setTimeout(() => setIntroStep(2), 4000),
        setTimeout(() => setIntroStep(3), 6000),
        setTimeout(() => onComplete(), 8500),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [videoFinished, onComplete]);

  if (!isPlaying) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-between h-full py-12">
          <div className="w-full space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <Activity size={14} className="text-red-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Acceso Prioritario</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white break-words">
              Garantizando tu <span className="text-red-600">bienestar</span>
            </h1>
            <p className="text-xl text-neutral-400 font-medium leading-tight px-4">
              Tu tranquilidad no puede ser una promesa. Es una deuda que vamos a ejecutar hoy.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={handleStart}
              className="group relative w-24 h-24 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-red-600 rounded-full group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]" />
              <Play className="relative z-10 text-white fill-white ml-1" size={32} />
            </button>
            <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-[0.3em] animate-pulse">
              Toca para entrar a la experiencia
            </p>
          </div>

          <div className="w-full">
            <button 
              onClick={onSkipToSales}
              className="text-neutral-600 hover:text-neutral-400 transition-colors text-xs font-medium underline underline-offset-4 decoration-neutral-700 hover:decoration-neutral-400"
            >
              Toca si ya viviste la experiencia
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!videoFinished) {
    return (
      <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
        <video 
          ref={videoRef}
          src="https://res.cloudinary.com/dtwegeovt/video/upload/v1770429768/copy_8D64D716-A45D-4F7F-A943-E40FB1319F55_c0bcld.mov"
          playsInline
          className="w-full h-full object-contain"
          onEnded={() => setVideoFinished(true)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {introStep === 0 && (
          <div className="animate-in fade-in zoom-in duration-700 text-center space-y-4">
            <Zap className="mx-auto text-red-600 mb-4" size={48} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Iniciando Protocolo</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto" />
          </div>
        )}

        {introStep === 1 && (
          <div className="animate-in slide-in-from-bottom duration-700 text-center space-y-4">
            <ShieldCheck className="mx-auto text-blue-500 mb-4" size={48} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Identificando la Ley</h2>
            <p className="text-neutral-500 font-mono text-sm">Escaneando registros vigentes...</p>
          </div>
        )}

        {introStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-700 text-center space-y-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white leading-none text-balance">
              El problema no es la ley.
            </h2>
            <div className="bg-red-600 p-2 transform -rotate-1 inline-block mx-auto">
               <h3 className="text-2xl font-black uppercase text-white tracking-widest">Es el abandono.</h3>
            </div>
          </div>
        )}

        {introStep === 3 && (
          <div className="animate-in zoom-in duration-1000 text-center space-y-8">
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />
              ))}
            </div>
            <h2 className="text-6xl font-black uppercase tracking-tighter text-white leading-none">
              Vladimir <br/> <span className="text-blue-600 italic">Ejecuta.</span>
            </h2>
            <p className="text-xs text-neutral-600 font-bold uppercase tracking-[0.4em]">Conexión Entrante...</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-red-600/30 w-full">
        <div 
          className="h-full bg-red-600 transition-all duration-[8000ms] ease-linear"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
