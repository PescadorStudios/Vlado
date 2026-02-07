
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onComplete: () => void;
}

export const Experience2_Scanner: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const messages = [
    "Iniciando escaneo ciudadano...",
    "Cruzando leyes vigentes...",
    "Verificando ejecución real...",
    "Resultado: LEYES EXISTEN / EJECUCIÓN: AUSENTE",
    "No es que falten leyes.",
    "Falta quien las ejecute."
  ];

  useEffect(() => {
    // Configurar y reproducir audio de escaneo en bucle
    const audio = new Audio('https://res.cloudinary.com/deirdgemo/video/upload/v1769388965/scann_bildmn.mp3');
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(err => {
      console.error("Scanner audio blocked or failed:", err);
      // Intento de recuperación si el navegador es restrictivo
      const retryPlay = () => {
        audio.play();
        window.removeEventListener('click', retryPlay);
      };
      window.addEventListener('click', retryPlay);
    });
    audioRef.current = audio;

    const progressTimers: NodeJS.Timeout[] = [];
    const messageTimers: NodeJS.Timeout[] = [];

    const intervals = [
      { p: 20, t: 1000 },
      { p: 55, t: 2500 },
      { p: 80, t: 4000 },
      { p: 100, t: 5500 }
    ];

    intervals.forEach(({ p, t }) => {
      progressTimers.push(setTimeout(() => setProgress(p), t));
    });

    messages.forEach((msg, i) => {
      messageTimers.push(setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg]);
        setPhase(i + 1);
      }, i * 1200 + 500));
    });

    const completionTimer = setTimeout(() => onCompleteRef.current(), 9000);

    return () => {
      clearTimeout(completionTimer);
      progressTimers.forEach(timer => clearTimeout(timer));
      messageTimers.forEach(timer => clearTimeout(timer));
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []); // Empty dependencies - only run once on mount

  return (
    <div className="fixed inset-0 bg-black p-8 font-mono flex flex-col justify-center gap-12 select-none overflow-hidden">
      {/* Visual scanning line effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-[scan_3s_infinite_linear]" />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <div className="space-y-4 max-w-md mx-auto w-full">
        {visibleMessages.map((msg, i) => (
          <div 
            key={i} 
            className={`text-sm md:text-lg break-words transition-all duration-500 ${
              i === 3 ? 'text-red-500 font-bold border-y border-red-900/50 py-4 my-6' : 'text-green-500'
            } ${i >= 4 ? 'animate-pulse' : ''}`}
          >
            <span className="mr-2">{'>'}</span>
            {msg}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md mx-auto space-y-4">
        <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
          <span>Escaneo en curso</span>
          <span>{progress}% complete</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-red-600/30 text-[10px] uppercase tracking-tighter">
          Acceso Restringido - Protocolo Vladimir - 2024
        </p>
      </div>
    </div>
  );
};
