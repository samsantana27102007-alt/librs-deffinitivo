import React from 'react';
import { SignData } from '../types';
import { ChevronDown } from 'lucide-react';

interface SignSelectProps {
  signs: SignData[];
  currentSignId: string;
  onChange: (signId: string) => void;
}

export const SignSelect: React.FC<SignSelectProps> = ({ signs, currentSignId, onChange }) => {
  const current = signs.find(s => s.id === currentSignId);

  return (
    <div className="relative inline-block w-full max-w-xs">
      <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-1">
        Praticar sinal:
      </label>
      <div className="relative">
        <select
          value={currentSignId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border-2 border-gray-200 hover:border-primary focus:border-primary text-textStrong font-semibold py-3 pl-4 pr-10 rounded-btn transition-colors cursor-pointer outline-none"
        >
          {signs.map((sign) => (
            <option key={sign.id} value={sign.id}>
              {sign.name} ({sign.category})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textSecondary">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};
