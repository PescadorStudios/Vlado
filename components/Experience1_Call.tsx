
import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Experience1_Call: React.FC<Props> = ({ onComplete }) => {
  const [status, setStatus] = useState<'incoming' | 'ongoing'>('incoming');
  const [seconds, setSeconds] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  // Inicialización de audios para evitar retrasos y bloqueos
  useEffect(() => {
    // Ringtone
    const ringtone = new Audio('https://res.cloudinary.com/deirdgemo/video/upload/v1769126271/ringtones-iphone-8-plus_apyhiw.mp3');
    ringtone.loop = true;
    ringtone.muted = false;
    ringtone.volume = 1.0;
    ringtoneRef.current = ringtone;

    // Voz de Camila (Pre-carga)
    const voice = new Audio('https://res.cloudinary.com/dtwegeovt/video/upload/v1771345967/ElevenLabs_2026-02-17T16_29_48_Lina_-_Carefree_Fresh_pvc_sp115_s50_sb75_se0_b_m2_qcqnge.mp3');
    voice.muted = false;
    voice.volume = 1.0;
    voice.load(); // Forzamos carga
    voiceRef.current = voice;

    if (status === 'incoming') {
      ringtone.play().catch(err => console.error("Ringtone playback failed:", err));
    }

    return () => {
      ringtone.pause();
      ringtone.currentTime = 0;
      ringtone.src = '';
      voice.pause();
      voice.currentTime = 0;
      voice.src = '';
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (status === 'ongoing') {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleAccept = () => {
    // 1. Detener ringtone inmediatamente
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
    }

    // 2. Cambiar estado visual
    setStatus('ongoing');

    // 3. Reproducir voz de Camila con re-intento si es necesario
    if (voiceRef.current) {
      voiceRef.current.play()
        .then(() => {
          console.log("Audio de voz iniciado correctamente");
        })
        .catch(err => {
          console.error("Fallo inicial de voz, reintentando...", err);
          // Forzamos play de nuevo (a veces el primer intento falla por milisegundos de delay de carga)
          if (voiceRef.current) voiceRef.current.play();
        });

      voiceRef.current.onended = () => {
        handleEndCall();
      };
    } else {
      // Fallback si por alguna razón el ref se perdió
      const fallbackVoice = new Audio('https://res.cloudinary.com/dtwegeovt/video/upload/v1771345967/ElevenLabs_2026-02-17T16_29_48_Lina_-_Carefree_Fresh_pvc_sp115_s50_sb75_se0_b_m2_qcqnge.mp3');
      fallbackVoice.play();
      fallbackVoice.onended = handleEndCall;
    }
  };

  const handleEndCall = () => {
    setFadeOut(true);
    setTimeout(onComplete, 1000);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={`fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-between py-20 px-6 transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-6 mt-12">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center border-4 border-neutral-700 overflow-hidden animate-pulse-custom shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <img
              src="https://res.cloudinary.com/dtwegeovt/image/upload/v1771123510/IMG_7904_gfcss6.jpg"
              alt="Camila Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {status === 'ongoing' && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-white">Camila</h2>
          <p className="text-neutral-400 font-medium tracking-wide">
            {status === 'incoming' ? 'Llamada entrante' : 'Llamada en curso'}
          </p>
          {status === 'ongoing' && (
            <p className="text-white font-mono text-xl tabular-nums">{formatTime(seconds)}</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm flex items-center justify-center mb-12">
        {status === 'incoming' ? (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleAccept}
              className="group flex flex-col items-center gap-3 transition-transform active:scale-95"
            >
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce group-hover:bg-green-600 transition-colors">
                <Phone className="text-white fill-white" size={36} />
              </div>
              <span className="text-sm text-neutral-300 font-bold uppercase tracking-[0.2em]">Contestar</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 opacity-50 grayscale cursor-not-allowed">
            <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center shadow-lg">
              <PhoneOff className="text-neutral-500 fill-neutral-500" size={32} />
            </div>
            <span className="text-xs text-neutral-600 font-bold uppercase tracking-widest">Escuchando...</span>
          </div>
        )}
      </div>

      <div className="flex gap-12 mb-8 opacity-40">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <span className="text-[10px] uppercase text-white font-bold">Silencio</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <span className="text-[10px] uppercase text-white font-bold">Teclado</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <span className="text-[10px] uppercase text-white font-bold">Altavoz</span>
        </div>
      </div>
    </div>
  );
};
