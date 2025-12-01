import React, { useState } from 'react';
import { Button } from './Button';
import { storageService } from '../services/storageService';
import { Hand } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    setIsLoading(true);
    await storageService.login(email, name);
    setIsLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
             <Hand size={40} className="text-primary" />
          </div>
          <h1 className="text-h1 text-primary mb-2">Aprenda Libras</h1>
          <p className="text-textSecondary">Sua plataforma de prática e feedback em tempo real.</p>
        </div>

        <div className="bg-white p-8 rounded-card shadow-soft border border-black/5">
          <h2 className="text-xl font-bold mb-6 text-textStrong">Crie sua conta ou entre</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Seu Nome</label>
              <input 
                type="text" 
                required
                className="w-full p-3 rounded-btn border-2 border-gray-200 bg-white text-textStrong focus:border-primary outline-none transition-colors placeholder:text-gray-400"
                placeholder="Ex: Maria Silva"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full p-3 rounded-btn border-2 border-gray-200 bg-white text-textStrong focus:border-primary outline-none transition-colors placeholder:text-gray-400"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">
              Começar a Praticar
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-textSecondary">
            <p>Ao entrar, você concorda com nossa política de aprendizado acessível.</p>
          </div>
        </div>
      </div>
    </div>
  );
};