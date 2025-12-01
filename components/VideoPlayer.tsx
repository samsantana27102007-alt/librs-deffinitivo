import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  signName: string;
  videoUrl?: string;
  isPlaying?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ signName }) => {
  // Como não temos arquivos reais de vídeo no ambiente de demo, criamos uma UI
  // que PARECE um player de vídeo profissional, mas usa animação CSS ou placeholder.
  
  return (
    <div className="w-full aspect-video bg-black rounded-card overflow-hidden relative group">
      {/* Fundo simulando thumbnail de vídeo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-black opacity-80" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform cursor-pointer border border-white/40">
           <Play fill="white" className="text-white ml-1" size={28} />
        </div>
        <p className="text-white font-medium tracking-wide">Ver correção para "{signName}"</p>
      </div>

      {/* Barra de progresso fake */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div className="h-full bg-secondary w-1/3" />
      </div>
    </div>
  );
};
