
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Cuando escuchas una promesa política, tú...",
    options: ["Ya no escuchas", "Esperas que falle", "Te da igual quién gane"]
  },
  {
    id: 2,
    question: "El mayor problema del país es...",
    options: ["Corrupción visible", "Burocracia invisible", "Promesas sin ejecución"]
  },
  {
    id: 3,
    question: "Si las leyes existen pero no se cumplen, entonces...",
    options: ["El sistema está roto", "Nadie responde", "Falta un ejecutor real"]
  }
];

interface Props {
  onComplete: () => void;
}

export const Experience3_Quiz: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (option: string) => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
      setTimeout(onComplete, 3500);
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
        <div className="w-20 h-1 bg-red-600 mb-8 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        <h3 className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4">Perfil Detectado</h3>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Ciudadano consciente.</h2>
        <p className="text-2xl font-light text-neutral-400 italic mb-6">Cansado.</p>
        <p className="text-xl font-medium text-white max-w-xs leading-relaxed">Listo para hechos, no discursos.</p>
      </div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col px-6 py-12 md:py-20 animate-in slide-in-from-right duration-500">
      <div className="flex-1 flex flex-col justify-center gap-12 max-w-lg mx-auto w-full">
        <div className="space-y-4">
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-red-600' : 'bg-neutral-800'}`} />
            ))}
          </div>
          <span className="text-xs text-neutral-600 font-bold uppercase">Pregunta {currentStep + 1} de {questions.length}</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight break-words">
          {q.question}
        </h2>

        <div className="grid gap-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="group relative w-full p-6 text-left rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-red-600 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-medium text-neutral-200 group-hover:text-white transition-colors">{opt}</span>
                <div className="w-6 h-6 rounded-full border-2 border-neutral-700 group-hover:border-red-600 transition-colors flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
