
import React from 'react';
import { Instagram } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Experience6_InstaLogin: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xs flex flex-col items-center gap-8">
        <h1 className="text-4xl font-serif italic text-neutral-800">Instagram</h1>
        
        <div className="w-full space-y-3">
          <input 
            type="text" 
            placeholder="Usuario, teléfono o correo" 
            defaultValue="EJECUTOR_8M"
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-sm focus:border-neutral-400 outline-none"
            readOnly
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            defaultValue="BIENESTAR_REAL"
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-sm focus:border-neutral-400 outline-none"
            readOnly
          />
          <button 
            onClick={onComplete}
            className="w-full py-2 bg-[#0095f6] text-white font-bold rounded text-sm hover:bg-[#1877f2] transition-colors"
          >
            Entrar al archivo privado
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-neutral-200" />
          <span className="text-[12px] text-neutral-400 font-bold uppercase">Aviso de seguridad</span>
          <div className="flex-1 h-[1px] bg-neutral-200" />
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-neutral-500 leading-relaxed px-4">
            Este acceso no es público.<br/>
            Es un respaldo interno.<br/>
            <span className="font-bold text-neutral-800">Entra. Observa. Decide.</span>
          </p>
          <div className="flex items-center justify-center gap-2 text-neutral-400">
            <Instagram size={16} />
            <span className="text-xs">Archive Access v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
