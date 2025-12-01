import React, { useEffect, useState } from 'react';
import { User, AppView } from '../types';
import { storageService } from '../services/storageService';
import { Button } from './Button';
import { Trophy, TrendingUp, Activity, Play, HelpCircle, LogOut } from 'lucide-react';
import { AVAILABLE_SIGNS } from '../constants';

interface DashboardProps {
  user: User;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onLogout }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(storageService.getStats());
  }, []);

  if (!stats) return null;

  return (
    <div className="w-full max-w-[680px] mx-auto px-6 py-8 animate-slideUp">
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-primary" />
          <div>
            <h1 className="text-h2 text-textStrong">Olá, {user.name.split(' ')[0]}!</h1>
            <p className="text-textSecondary text-body2">Vamos praticar hoje?</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 text-textSecondary hover:text-error transition-colors" title="Sair">
          <LogOut size={20} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-card shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
          <div className="mb-2 p-2 bg-purple-100 rounded-full text-primary">
            <Trophy size={20} />
          </div>
          <span className="text-2xl font-bold text-textStrong">{stats.totalAttempts}</span>
          <span className="text-xs text-textSecondary font-medium">Práticas</span>
        </div>
        <div className="bg-white p-4 rounded-card shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
          <div className="mb-2 p-2 bg-green-100 rounded-full text-success">
            <TrendingUp size={20} />
          </div>
          <span className="text-2xl font-bold text-textStrong">{stats.correctRate}%</span>
          <span className="text-xs text-textSecondary font-medium">Precisão</span>
        </div>
        <div className="bg-white p-4 rounded-card shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
          <div className="mb-2 p-2 bg-orange-100 rounded-full text-secondary">
            <Activity size={20} />
          </div>
          <span className="text-2xl font-bold text-textStrong">{stats.streak}</span>
          <span className="text-xs text-textSecondary font-medium">Streak</span>
        </div>
      </div>

      {/* Ações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => onNavigate(AppView.PRACTICE)}
          className="group relative overflow-hidden bg-primary text-white p-6 rounded-card shadow-md hover:shadow-lg transition-all duration-300 text-left flex flex-col h-32 justify-between"
        >
          <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Play size={120} />
          </div>
          <div className="p-2 bg-white/20 w-fit rounded-lg mb-2">
            <Play size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Praticar Sinais</h3>
            <p className="text-sm opacity-90">Use a câmera para treinar</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(AppView.QUIZ)}
          className="group relative overflow-hidden bg-white border-2 border-primary text-primary p-6 rounded-card shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col h-32 justify-between"
        >
          <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:scale-110 transition-transform duration-500">
            <HelpCircle size={120} />
          </div>
          <div className="p-2 bg-primary/10 w-fit rounded-lg mb-2">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Modo Adivinhar</h3>
            <p className="text-sm text-textSecondary">Teste seu vocabulário</p>
          </div>
        </button>
      </div>

      {/* Lista de Sinais / Progresso Detalhado */}
      <h3 className="text-h2 mb-4">Seu Progresso</h3>
      <div className="bg-white rounded-card shadow-sm border border-black/5 overflow-hidden">
        {AVAILABLE_SIGNS.map((sign, index) => {
          const signStat = stats.signStats[sign.id] || { total: 0, correct: 0 };
          const accuracy = signStat.total > 0 ? Math.round((signStat.correct / signStat.total) * 100) : 0;
          
          return (
            <div key={sign.id} className={`p-4 flex items-center justify-between ${index !== AVAILABLE_SIGNS.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div>
                <p className="font-bold text-textStrong">{sign.name}</p>
                <p className="text-xs text-textSecondary">{sign.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{accuracy}%</p>
                  <p className="text-[10px] text-textSecondary uppercase tracking-wide">Acerto</p>
                </div>
                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${accuracy > 80 ? 'bg-success' : accuracy > 40 ? 'bg-orange-400' : 'bg-error'}`} 
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
