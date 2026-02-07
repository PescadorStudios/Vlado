
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const videoData = [
  { 
    id: 1, 
    url: "https://res.cloudinary.com/dtwegeovt/video/upload/v1770434181/copy_7CDDBBD5-ACCB-4C8C-9684-154EAE50E1D6_d3kmr0.mov",
    caption: "Garantizando tu bienestar. La ejecución es ahora."
  },
  { 
    id: 2, 
    url: "https://res.cloudinary.com/dtwegeovt/video/upload/v1770434180/copy_5DEF6A3A-01F7-4B27-AFA4-01CBC0BFED21_e1pvex.mov",
    caption: "Antes se prometía, hoy se ejecuta. Vladimir responde."
  },
  { 
    id: 3, 
    url: "https://res.cloudinary.com/dtwegeovt/video/upload/v1770434181/copy_C248C514-642B-4C58-927F-CF83211B38CA_yykqfg.mov",
    caption: "El bienestar no es un eslogan, es un derecho que vamos a ejecutar."
  }
];

export const Experience7_Feed: React.FC<Props> = ({ onComplete }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6, // El video debe estar al menos al 60% visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIdx(index);
          
          // Reproducir el video que entró en vista
          const video = videoRefs.current[index];
          if (video) {
            video.currentTime = 0;
            video.play().catch(e => console.log("Auto-play blocked", e));
          }
        } else {
          // Pausar el video que salió de vista
          const index = Number(entry.target.getAttribute('data-index'));
          const video = videoRefs.current[index];
          if (video) video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observar cada contenedor de video
    const videoContainers = containerRef.current?.querySelectorAll('.video-snap-item');
    videoContainers?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center overflow-hidden">
      {/* Contenedor principal limitado en escritorio */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[450px] h-[100dvh] bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videoData.map((v, i) => (
          <div 
            key={v.id}
            data-index={i}
            className="video-snap-item relative w-full h-[100dvh] snap-start snap-always flex flex-col"
          >
            {/* Player Container */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={el => videoRefs.current[i] = el}
                src={v.url}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
                onClick={() => {
                  const video = videoRefs.current[i];
                  if (video) {
                    video.paused ? video.play() : video.pause();
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
              <div className="absolute left-0 bottom-0 w-full z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white/30 flex items-center justify-center font-black text-lg italic shadow-xl">V</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1">
                      vladimir.ejecucion
                      <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-2 h-2 text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    </span>
                    <span className="text-[10px] text-neutral-300 font-medium">Audio original • Vladimir</span>
                  </div>
                  <button className="ml-auto text-[11px] font-bold border border-white/40 bg-white/10 px-4 py-1.5 rounded-lg backdrop-blur-sm active:bg-white/20">Seguir</button>
                </div>
                <p className="text-sm text-white font-medium leading-relaxed drop-shadow-lg pr-12">
                  {v.caption} <span className="text-blue-400 font-bold">#EjecucionReal #Bienestar #Vladimir</span>
                </p>
                
                {/* Indicador de scroll o botón final */}
                {i === videoData.length - 1 ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onComplete(); }}
                    className="mt-6 w-full bg-red-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all"
                  >
                    Finalizar Archivo
                  </button>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-white/50 font-bold uppercase tracking-widest animate-pulse">
                    <span>Desliza para más</span>
                    <ChevronDown size={14} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};
