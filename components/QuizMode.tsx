import React, { useState } from 'react';
import { AVAILABLE_SIGNS } from '../constants';
import { SignIllustration } from './SignIllustration';
import { Button } from './Button';
import { Check, X, ArrowRight } from 'lucide-react';
import { storageService } from '../services/storageService';

interface QuizModeProps {
  onBack: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  
  // Randomizar a ordem poderia ser adicionado aqui, mas vamos manter simples
  const currentSign = AVAILABLE_SIGNS[currentIndex];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim()) return;

    const isCorrect = userInput.toLowerCase().trim() === currentSign.name.toLowerCase().trim();
    setStatus(isCorrect ? 'CORRECT' : 'WRONG');

    // Salvar histórico
    storageService.saveAttempt({
      signId: currentSign.id,
      timestamp: Date.now(),
      isCorrect,
      mode: 'QUIZ'
    });
  };

  const nextQuestion = () => {
    setStatus('IDLE');
    setUserInput('');
    setCurrentIndex((prev) => (prev + 1) % AVAILABLE_SIGNS.length);
  };

  return (
    <div className="w-full max-w-[680px] mx-auto px-6 py-8 flex flex-col h-full min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-textSecondary hover:text-primary font-medium">
          &larr; Voltar
        </button>
        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          Quiz: {currentIndex + 1} / {AVAILABLE_SIGNS.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-h2 text-center mb-2">Qual é este sinal?</h2>
        <p className="text-textSecondary mb-8 text-center">Observe a ilustração e digite o nome do sinal.</p>

        <div className="mb-8 w-full max-w-xs p-6 bg-white rounded-card shadow-sm border border-gray-100">
           {/* Reutilizando a ilustração, mas sem o nome */}
           <SignIllustration signId={currentSign.id} />
        </div>

        <div className="w-full max-w-md space-y-4">
            {status === 'IDLE' ? (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Digite o nome do sinal..."
                        className="w-full h-[52px] rounded-btn border-2 border-gray-200 bg-white text-textStrong placeholder:text-gray-400 px-4 text-lg outline-none focus:border-secondary transition-colors"
                        autoFocus
                    />
                    <Button type="submit">Confirmar Resposta</Button>
                </form>
            ) : (
                <div className={`w-full p-6 rounded-card border-2 flex flex-col items-center text-center animate-slideUp ${status === 'CORRECT' ? 'bg-successBg border-success/20' : 'bg-errorBg border-error/20'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${status === 'CORRECT' ? 'bg-success text-white' : 'bg-error text-white'}`}>
                         {status === 'CORRECT' ? <Check /> : <X />}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-1 ${status === 'CORRECT' ? 'text-success' : 'text-error'}`}>
                        {status === 'CORRECT' ? 'Acertou!' : 'Incorreto'}
                    </h3>
                    
                    {status === 'WRONG' && (
                        <p className="text-textSecondary mb-4">
                            A resposta correta era: <span className="font-bold text-textStrong">{currentSign.name}</span>
                        </p>
                    )}

                    <Button onClick={nextQuestion} className="w-full mt-4" variant={status === 'CORRECT' ? 'primary' : 'secondary'}>
                        Próximo <ArrowRight size={20} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};