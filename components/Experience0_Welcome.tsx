
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
        // Paso final es manual ahora para habilitar audio en iOS
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [videoFinished, onComplete]);

  if (!isPlaying) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
            src="https://res.cloudinary.com/dtwegeovt/video/upload/f_auto,q_auto/v1771085071/copy_7E034931-DE61-42E1-B749-0C64E19EE061_f7zpjb.mov"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-between h-[100dvh] py-16 px-6">
          <div className="w-full space-y-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-top duration-700">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">Acceso Exclusivo</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] text-white flex flex-col items-center animate-in zoom-in duration-700">
                <span>LA LEY DEL</span>
                <span className="text-red-600 italic">BIENESTAR</span>
              </h1>
              <p className="text-neutral-300 font-mono text-[10px] uppercase tracking-[0.4em] mt-4 opacity-60">
                Archivo Privado • Protocolo 771
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
            <button
              onClick={handleStart}
              className="group relative w-24 h-24 flex items-center justify-center transition-transform active:scale-95"
            >
              <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-25" />
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/40 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.6)] group-hover:scale-105 transition-transform border border-white/20" />
              <div className="relative z-10 w-20 h-20 bg-black/20 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/10">
                <Play className="text-white fill-white ml-1 group-hover:scale-110 transition-transform" size={32} />
              </div>
            </button>
            <div className="space-y-4 text-center">
              <p className="text-sm text-white font-bold uppercase tracking-[0.2em] animate-pulse">
                Toca para entrar
              </p>
              <p className="text-[11px] text-neutral-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                Tu tranquilidad no puede ser una promesa. <br /> Es una <span className="text-white font-bold">deuda</span> que vamos a ejecutar hoy.
              </p>
            </div>
          </div>

          <div className="w-full text-center">
            <button
              onClick={onSkipToSales}
              className="text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest underline underline-offset-8 decoration-white/20 hover:decoration-white/50"
            >
              YA VIVÍ LA EXPERIENCIA
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
          src="https://res.cloudinary.com/dtwegeovt/video/upload/v1771346903/copy_49A27508-DC8A-43C8-87FF-6B1D000FB237_uuyb4n.mov"
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
          <div className="animate-in zoom-in duration-500 text-center space-y-8">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">
              Vladimir <br /> <span className="text-blue-600 italic">Ejecuta.</span>
            </h2>

            <button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-500 text-white font-black text-xl uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_0_40px_rgba(22,163,74,0.6)] animate-pulse hover:animate-none transition-all transform hover:scale-105 active:scale-95"
            >
              Recibir Llamada
            </button>

            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-4">
              Click para conectar
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-red-600/30 w-full">
        <div
          className="h-full bg-red-600 transition-all duration-[6000ms] ease-out"
          style={{ width: introStep < 3 ? `${(introStep + 1) * 33}%` : '100%' }}
        />
      </div>
    </div>
  );
};
