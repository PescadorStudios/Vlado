import React from 'react';
import { Instagram, Shield, Lock, Eye } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Experience6_InstaLogin: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[340px] relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
            <Lock size={12} className="text-red-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Servidor de Respaldo Seguro</span>
          </div>
          <h1 className="text-5xl font-serif italic text-white tracking-tight">Instagram</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Acceso a Evidencia</p>
        </div>

        {/* Login Container */}
        <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[32px] shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Usuario o correo"
                defaultValue="EJECUTOR_8M"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white placeholder-neutral-600 focus:border-red-500/50 focus:bg-white/10 outline-none transition-all font-medium"
                readOnly
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña"
                defaultValue="BIENESTAR_REAL"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white placeholder-neutral-600 focus:border-red-500/50 focus:bg-white/10 outline-none transition-all font-medium"
                readOnly
              />
            </div>

            <button
              onClick={onComplete}
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest transition-all transform active:scale-95 shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_12px_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              Ver Archivo Privado
            </button>
          </div>

          {/* Blinking Call to Action */}
          <div className="mt-8 text-center">
            <p className="text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse-fast">
              ••• Click para entrar •••
            </p>
          </div>
        </div>

        {/* Security Meta */}
        <div className="mt-6 flex items-center justify-between px-4 text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
          <span>Encripción 256-bit</span>
          <span>Acceso Restringido v4.0</span>
          <span>IP Registrada</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.98); }
        }
        .animate-pulse-fast {
          animation: pulse-fast 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
