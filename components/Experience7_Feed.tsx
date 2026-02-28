
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const FEED_VIDEO_URL = "https://res.cloudinary.com/dtwegeovt/video/upload/v1771348462/copy_8B2E9F45-4F74-47D5-92C9-2FC88A343478_jifruh.mov";

export const Experience7_Feed: React.FC<Props> = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play attempt on mount
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Auto-play blocked", e));
    }
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Contenedor principal estilo móvil */}
      <div className="relative w-full max-w-[450px] h-[100dvh] bg-black flex flex-col">

        {/* Player Container */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={FEED_VIDEO_URL}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            onEnded={() => setVideoEnded(true)}
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
              }
            }}
          />

          {/* Mute Toggle Overlay */}
          <button
            onClick={toggleMute}
            className="absolute top-6 right-6 z-20 bg-black/40 p-2.5 rounded-full backdrop-blur-md text-white border border-white/10 active:scale-90 transition-transform"
          >
            {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>

          {/* Interaction Bar (Instagram Style) */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-10">
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5 transition-transform active:scale-90">
                <Heart className="text-white fill-red-600 border-red-600" size={24} />
              </div>
              <span className="text-[10px] text-white mt-1 font-bold drop-shadow-lg">42.1K</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5">
                <MessageCircle className="text-white" size={24} />
              </div>
              <span className="text-[10px] text-white mt-1 font-bold drop-shadow-lg">1.2K</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5">
                <Send className="text-white" size={24} />
              </div>
            </div>
            <Bookmark className="text-white" size={24} />
            <MoreVertical className="text-white" size={24} />
          </div>

          {/* Footer Info Overlay */}
          <div className="absolute left-0 bottom-0 w-full z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white/30 flex items-center justify-center font-black text-lg italic shadow-xl">V</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1">
                  vladimir.ejecucion
                  <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-2 h-2 text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </div>
                </span>
                <span className="text-[10px] text-neutral-300 font-medium">Audio original • Vladimir</span>
              </div>
              <button className="ml-auto text-[11px] font-bold border border-white/40 bg-white/10 px-4 py-1.5 rounded-lg backdrop-blur-sm active:bg-white/20">Seguir</button>
            </div>
            <p className="text-sm text-white font-medium leading-relaxed drop-shadow-lg pr-12">
              La evidencia es clara. El momento de actuar es ahora mismo. <span className="text-blue-400 font-bold">#EjecucionReal #Bienestar #Vladimir</span>
            </p>

            {/* Botón final (Solo aparece al terminar o como CTA principal) */}
            <div className={`mt-6 transition-all duration-700 ${videoEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <button
                onClick={(e) => { e.stopPropagation(); onComplete(); }}
                className="w-full bg-red-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all animate-pulse"
              >
                Finalizar Archivo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decoración lateral para escritorio */}
      <div className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 flex-col gap-8 opacity-20 pointer-events-none">
        <h3 className="text-6xl font-black uppercase vertical-text tracking-tighter text-white">ARCHIVO</h3>
        <div className="h-40 w-[1px] bg-white/50 mx-auto" />
      </div>
      <div className="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-8 opacity-20 pointer-events-none">
        <h3 className="text-6xl font-black uppercase vertical-text tracking-tighter text-white">PRIVADO</h3>
        <div className="h-40 w-[1px] bg-white/50 mx-auto" />
      </div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};
