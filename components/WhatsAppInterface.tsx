
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MoreVertical, Phone, Video, Send, User, CheckCheck } from 'lucide-react';

interface Props {
  contactName: string;
  messages: string[];
  onComplete: () => void;
  buttonLabel?: string;
}

export const WhatsAppInterface: React.FC<Props> = ({ contactName, messages, onComplete, buttonLabel = "Continuar" }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount < messages.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setVisibleCount(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount, isTyping]);

  const allShown = visibleCount === messages.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-100 whatsapp-bg">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-3 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <ChevronLeft size={24} />
          <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center overflow-hidden">
            <User className="text-neutral-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-none">{contactName}</span>
            <span className="text-[11px] opacity-80">{isTyping ? 'escribiendo...' : 'en línea'}</span>
          </div>
        </div>
        <div className="flex items-center gap-5 opacity-90">
          <Video size={20} className="fill-white" />
          <Phone size={18} className="fill-white" />
          <MoreVertical size={20} />
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scroll-smooth">
        {messages.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className="flex flex-col gap-1 max-w-[85%] animate-in slide-in-from-left duration-300">
            <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-sm text-[15px] text-neutral-800 leading-snug break-words">
              {msg}
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-neutral-400">12:00</span>
                <CheckCheck size={14} className="text-blue-500" />
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="bg-white/90 px-4 py-2 rounded-full w-20 flex justify-around shadow-sm">
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Input area or CTA */}
      <div className="p-3 bg-neutral-100 flex items-center gap-2">
        {allShown ? (
          <button
            onClick={onComplete}
            className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 animate-pulse"
          >
            {buttonLabel}
          </button>
        ) : (
          <>
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-neutral-400 flex items-center gap-2 shadow-sm border border-neutral-200">
              <span className="text-sm">Lectura única activada...</span>
            </div>
            <div className="w-11 h-11 bg-[#075e54] rounded-full flex items-center justify-center text-white shadow-md">
              <Send size={20} className="ml-0.5" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
