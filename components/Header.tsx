import React from 'react';
import { Hand } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 flex items-center justify-center bg-background sticky top-0 z-50">
      <div className="flex items-center gap-2 text-primary" aria-label="Aprenda Libras Logo">
        {/* Using a simple icon representation to keep it minimal and vector-like */}
        <div className="p-2 bg-primary/5 rounded-full">
          <Hand size={24} strokeWidth={2} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight font-sans text-primary">Aprenda Libras</h1>
      </div>
    </header>
  );
};