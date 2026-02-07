
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Play, Key, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const VSL_VIDEO_URL = "https://res.cloudinary.com/dtwegeovt/video/upload/v1770443689/copy_6DA685EB-8191-457C-9340-D8C358A8B3CE_a6hiqx.mp4";

export const Experience5_VSL: React.FC<Props> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Video play failed:", err);
          // Re-intento forzado en caso de bloqueo de política de navegador
          if (videoRef.current) videoRef.current.play();
          setIsPlaying(true);
        });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full h-full max-w-[450px] mx-auto flex flex-col shadow-2xl bg-black overflow-hidden">
        
        {/* Encrypted Header */}
        <div className="absolute top-0 left-0 w-full z-20 px-6 py-8 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldCheck size={16} />
            <span className="text-[9px] uppercase font-black tracking-[0.4em]">Protocolo Cifrado Activo</span>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded border border-white/5">
                <Lock size={10} className="text-green-500" />
                <span className="text-[8px] text-neutral-400 font-mono tracking-widest uppercase">771-VLAD-EX-01</span>
             </div>
             <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded border border-white/5">
                <RefreshCw size={10} className="text-blue-500 animate-spin-slow" />
                <span className="text-[8px] text-neutral-400 font-mono tracking-widest uppercase">Streaming</span>
             </div>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
          
          {/* El video siempre está presente pero oculto si no está en play */}
          <video
            ref={videoRef}
            src={VSL_VIDEO_URL}
            className={`w-full h-full object-contain transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setVideoEnded(true)}
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
              }
            }}
          />

          {/* Overlay de inicio (solo visible antes de dar Play) */}
          {!isPlaying && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-black">
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="relative group cursor-pointer mx-auto w-24 h-24" onClick={handleStart}>
                   <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20" />
                   <div className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform">
                      <Play className="text-white fill-white ml-1" size={32} />
                   </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Archivo de Ejecución</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed px-4">
                    Has sido autorizado para ver este mecanismo operativo. <br/>
                    <span className="text-white font-bold italic">Toca para reproducir.</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Controles de Mute y Progreso (Solo cuando el video corre) */}
          {isPlaying && !videoEnded && (
            <>
              <button 
                onClick={toggleMute}
                className="absolute bottom-24 right-6 z-30 bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition-transform text-white"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-900 z-30">
                <div 
                  className="h-full bg-red-600 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}

          {/* End State CTA */}
          {videoEnded && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
              <div className="space-y-8 text-center max-w-xs">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                  <Key className="text-white" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Transmisión Finalizada</h3>
                  <p className="text-neutral-400 text-sm font-medium">Ya viste cómo funciona el mecanismo de ejecución. Ahora, toma una decisión.</p>
                </div>
                <button 
                  onClick={onComplete}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-lg uppercase tracking-widest py-5 rounded-2xl shadow-2xl shadow-red-900/40 active:scale-95 transition-all"
                >
                  Confirmar Información
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer decoration */}
        <div className="p-6 bg-[#050505] border-t border-neutral-900">
           <div className="flex justify-between items-center opacity-40">
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">ID Sesión</span>
                <span className="text-xs font-mono text-white tracking-widest">EJECUTOR_8M</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Status</span>
                <span className="text-xs font-mono text-green-500 tracking-widest">VERIFIED</span>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
