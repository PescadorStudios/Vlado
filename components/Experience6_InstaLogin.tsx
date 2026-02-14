
import React from 'react';
import { Shield, Lock, User, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Experience6_InstaLogin: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-md relative">
        {/* Glassmorphism Card */}
        <div className="relative z-10 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
          {/* Subtle light sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest text-center">
              Login <span className="text-red-500">Comunidad</span> Privada
            </h1>
            <div className="h-1 w-12 bg-red-600 mt-2 rounded-full" />
          </div>

          {/* Credentials Form */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-neutral-500 group-focus-within:text-red-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                defaultValue="Leydelbienestar"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium placeholder:text-neutral-600 focus:border-red-500/50 focus:bg-white/10 outline-none transition-all"
                readOnly
              />
              <label className="absolute -top-2.5 left-4 px-2 bg-[#121212] text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Usuario</label>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-neutral-500 group-focus-within:text-red-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                defaultValue="VladimirEjecuta"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium placeholder:text-neutral-600 focus:border-red-500/50 focus:bg-white/10 outline-none transition-all"
                readOnly
              />
              <label className="absolute -top-2.5 left-4 px-2 bg-[#121212] text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Clave</label>
            </div>

            <button
              onClick={onComplete}
              className="group relative w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest">Acceder al Sistema</span>
              <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
              {/* Button Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
