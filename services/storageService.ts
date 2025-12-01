import { User, PracticeHistory } from '../types';

// Chaves do LocalStorage
const STORAGE_KEYS = {
  USER: 'libras_app_user',
  HISTORY: 'libras_app_history',
};

// Simulação de "Banco de Dados" local
export const storageService = {
  // --- Auth ---
  login: async (email: string, name: string): Promise<User> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user: User = {
      id: btoa(email), // ID "falso" baseado no email
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=461E52&color=fff`
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  // --- Histórico / Progresso ---
  saveAttempt: (attempt: PracticeHistory) => {
    const history = storageService.getHistory();
    history.push(attempt);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  getHistory: (): PracticeHistory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  getStats: () => {
    const history = storageService.getHistory();
    const totalAttempts = history.length;
    const correctAttempts = history.filter(h => h.isCorrect).length;
    
    // Agrupar por sinal para ver qual é mais difícil
    const signStats: Record<string, { correct: number, total: number }> = {};
    
    history.forEach(h => {
      if (!signStats[h.signId]) signStats[h.signId] = { correct: 0, total: 0 };
      signStats[h.signId].total += 1;
      if (h.isCorrect) signStats[h.signId].correct += 1;
    });

    return {
      totalAttempts,
      correctRate: totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100),
      streak: calculateStreak(history), // Função auxiliar simplificada
      signStats
    };
  }
};

function calculateStreak(history: PracticeHistory[]): number {
  // Lógica simplificada de streak (apenas conta tentativas recentes consecutivas para o MVP)
  // Num app real, verificaria dias consecutivos.
  let streak = 0;
  const reversed = [...history].reverse();
  for (const h of reversed) {
    if (h.isCorrect) streak++;
    else break;
  }
  return streak;
}
