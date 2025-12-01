import React from 'react';

interface SignIllustrationProps {
  signId: string;
}

export const SignIllustration: React.FC<SignIllustrationProps> = ({ signId }) => {
  // Paleta de cores alinhada ao Style Guide
  const c = {
    skin: '#F3E5F5',      // Roxo bem claro para a pele (Base)
    outline: '#461E52',   // Roxo escuro para contornos (Primary)
    accent: '#DD517F',    // Rosa para detalhes de fundo
    arrow: '#E68E36',     // Laranja para setas de movimento
    bgBlob: '#F5F6FA',    // Fundo discreto
    context: '#A090B0'    // Cor para linhas de contexto (rosto/corpo) - Mais suave
  };

  const renderSignContent = () => {
    switch (signId) {
      case 'oi':
        return (
          <g transform="translate(40, 20)">
             {/* Contexto: Perfil do Rosto (Geométrico/Simplificado) */}
             <path 
               d="M 60 10 C 60 10 30 15 30 50 C 30 70 40 85 50 95" 
               fill="none" 
               stroke={c.context} 
               strokeWidth="2" 
               strokeDasharray="4 4" 
               strokeLinecap="round"
             />
             
             {/* Grupo da Mão: Configuração 'I' (Mindinho levantado) */}
             <g transform="translate(80, 50)">
                {/* 1. Dedos Dobrados (Bloco principal do punho) */}
                <path 
                  d="M 0 20 Q -5 20 -5 30 V 55 Q -5 65 5 65 H 30 Q 40 65 40 55 V 30 Q 40 20 30 20 H 0 Z" 
                  fill={c.skin} 
                  stroke={c.outline} 
                  strokeWidth="2.5" 
                />
                
                {/* 2. Divisórias dos dedos dobrados (Linhas internas) */}
                <line x1="10" y1="20" x2="10" y2="65" stroke={c.outline} strokeWidth="1" opacity="0.3" />
                <line x1="25" y1="20" x2="25" y2="65" stroke={c.outline} strokeWidth="1" opacity="0.3" />

                {/* 3. Dedo Mindinho (Levantado - Destaque do sinal) */}
                <path 
                  d="M 30 22 V -10 C 30 -18 42 -18 42 -10 V 22" 
                  fill={c.skin} 
                  stroke={c.outline} 
                  strokeWidth="2.5" 
                />
                
                {/* 4. Polegar (Curvado sobre os dedos) */}
                <path 
                  d="M -5 45 C 5 40 20 35 35 45" 
                  fill="none" 
                  stroke={c.outline} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
             </g>

             {/* Seta de Movimento: Circular ao redor do mindinho */}
             <path 
               d="M 135 30 Q 155 50 135 70" 
               fill="none" 
               stroke={c.arrow} 
               strokeWidth="4" 
               strokeDasharray="6 4" 
               strokeLinecap="round"
               markerEnd="url(#arrowhead)"
             />
             <text x="135" y="90" fontSize="11" fill={c.outline} fontWeight="600" textAnchor="middle" style={{ fontFamily: 'Inter' }}>Girar</text>
          </g>
        );

      case 'obrigado':
        return (
          <g transform="translate(45, 20)">
            {/* Contexto: Perfil Lateral da Cabeça (Para mostrar a distância da mão) */}
            <path 
              d="M 40 20 C 20 20 10 40 10 70 C 10 100 30 120 60 120" 
              fill="none" 
              stroke={c.context} 
              strokeWidth="2" 
              strokeDasharray="4 4" 
              strokeLinecap="round"
            />
            {/* Detalhe do nariz para indicar direção (Direita) */}
            <path d="M 10 60 L 0 68 L 10 75" fill="none" stroke={c.context} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>

            {/* Grupo da Mão: Plana (Configuração B) tocando a testa */}
            <g transform="translate(40, 20) rotate(-15)">
               {/* Palma/Dedos: Retângulo arredondado */}
               <rect x="0" y="0" width="50" height="30" rx="8" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               
               {/* Polegar: Lateral */}
               <path d="M 10 30 Q 15 42 35 30" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               
               {/* Linhas indicando dedos unidos */}
               <line x1="16" y1="5" x2="16" y2="25" stroke={c.outline} strokeWidth="1" opacity="0.3" />
               <line x1="33" y1="5" x2="33" y2="25" stroke={c.outline} strokeWidth="1" opacity="0.3" />
            </g>

            {/* Seta de Movimento: Saindo da testa para frente/baixo */}
            <path 
              d="M 100 40 Q 140 40 140 90" 
              fill="none" 
              stroke={c.arrow} 
              strokeWidth="4" 
              strokeDasharray="6 4" 
              markerEnd="url(#arrowhead)"
            />
            <text x="130" y="110" fontSize="11" fill={c.outline} fontWeight="600" textAnchor="middle" style={{ fontFamily: 'Inter' }}>Para frente</text>
          </g>
        );

      case 'bom-dia':
        return (
          <g transform="translate(40, 30)">
             {/* Contexto: Boca/Queixo */}
             <path d="M 30 40 Q 50 50 70 40" fill="none" stroke={c.context} strokeWidth="2" strokeDasharray="4 4" />
             
             {/* Mão: Configuração 'D' */}
             <g transform="translate(60, 45)">
                {/* Punho fechado */}
                <rect x="0" y="15" width="35" height="30" rx="10" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
                {/* Dedo indicador esticado para CIMA */}
                <rect x="5" y="-15" width="14" height="40" rx="6" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
                {/* Polegar unindo com os dedos médios (formando a bolinha do D) */}
                <path d="M 5 25 Q 20 35 35 25" fill="none" stroke={c.outline} strokeWidth="2.5" />
             </g>

             {/* Movimento: Para frente */}
             <path 
               d="M 100 65 L 140 65" 
               fill="none" 
               stroke={c.arrow} 
               strokeWidth="3" 
               strokeDasharray="4 4" 
               markerEnd="url(#arrowhead)"
             />
             
             {/* Sol nascendo (Contexto do "Dia") */}
             <g transform="translate(130, 30)">
                 <path d="M 0 20 Q 20 0 40 20" fill="none" stroke={c.arrow} strokeWidth="2" strokeDasharray="2 2" />
                 <line x1="20" y1="0" x2="20" y2="-10" stroke={c.arrow} strokeWidth="2" />
                 <line x1="40" y1="10" x2="48" y2="4" stroke={c.arrow} strokeWidth="2" />
                 <line x1="0" y1="10" x2="-8" y2="4" stroke={c.arrow} strokeWidth="2" />
             </g>
          </g>
        );

      case 'familia':
        return (
          <g transform="translate(20, 20)">
            {/* Mão Esquerda: Configuração 'F' */}
            <g transform="translate(20, 60)">
               {/* 3 Dedos para cima (abertos) */}
               <path d="M 0 0 L -5 -30 Q -8 -35 0 -35 Q 8 -35 5 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               <path d="M 12 0 L 15 -35 Q 18 -40 26 -40 Q 34 -40 30 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               <path d="M 30 0 L 38 -30 Q 42 -35 50 -35 Q 58 -35 54 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               
               {/* Círculo do polegar e indicador (Configuração F) */}
               <circle cx="20" cy="15" r="14" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               <path d="M 20 15 L 40 25" stroke={c.outline} strokeWidth="1" opacity="0.3" /> {/* Linha palma */}
            </g>

            {/* Mão Direita: Configuração 'F' */}
            <g transform="translate(120, 60)">
               {/* 3 Dedos para cima */}
               <path d="M 0 0 L -5 -30 Q -8 -35 0 -35 Q 8 -35 5 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               <path d="M 12 0 L 15 -35 Q 18 -40 26 -40 Q 34 -40 30 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
               <path d="M 30 0 L 38 -30 Q 42 -35 50 -35 Q 58 -35 54 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />

               {/* Círculo do F */}
               <circle cx="25" cy="15" r="14" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
            </g>

            {/* Setas de Movimento: Círculo Horizontal encontrando */}
            <path 
              d="M 50 40 Q 90 10 130 40" 
              fill="none" 
              stroke={c.arrow} 
              strokeWidth="3" 
              strokeDasharray="4 4"
            />
             <path 
              d="M 50 90 Q 90 120 130 90" 
              fill="none" 
              stroke={c.arrow} 
              strokeWidth="3" 
              strokeDasharray="4 4"
              markerEnd="url(#arrowhead)"
            />
            <text x="90" y="130" fontSize="12" fill={c.outline} fontWeight="bold" textAnchor="middle" style={{ fontFamily: 'Inter' }}>Encontro das mãos</text>
          </g>
        );
      
      case 'amor':
        return (
           <g transform="translate(50, 20)">
              {/* Contexto: Peito / Coração */}
              <path d="M 50 30 C 20 10 0 40 50 90 C 100 40 80 10 50 30" fill={c.accent} opacity="0.15" stroke="none" />
              
              {/* Mão: Aberta sobre o peito */}
              <g transform="translate(30, 40)">
                 {/* Palma da mão */}
                 <rect x="0" y="0" width="45" height="45" rx="8" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
                 
                 {/* Dedos */}
                 <path d="M 5 0 V -15 Q 5 -22 12 -22 Q 19 -22 19 -15 V 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
                 <path d="M 23 0 V -18 Q 23 -25 30 -25 Q 37 -25 37 -18 V 0" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
                 
                 {/* Polegar */}
                 <path d="M 45 15 Q 60 10 60 25 Q 60 40 45 35" fill={c.skin} stroke={c.outline} strokeWidth="2.5" />
              </g>

              {/* Seta: Movimento Circular no peito */}
              <circle cx="52" cy="55" r="35" fill="none" stroke={c.arrow} strokeWidth="3" strokeDasharray="5 5" opacity="0.5" />
              <path 
                 d="M 85 45 Q 95 65 75 80" 
                 fill="none" 
                 stroke={c.arrow} 
                 strokeWidth="3" 
                 markerEnd="url(#arrowhead)" 
              />
           </g>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-6 bg-white rounded-card shadow-sm border border-black/5">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 L0,0" fill="#E68E36" />
            </marker>
          </defs>
          
          {/* Fundo Decorativo Sutil */}
          <circle cx="100" cy="100" r="90" fill={c.bgBlob} opacity="0.6" />
          
          {renderSignContent()}
        </svg>
      </div>
    </div>
  );
};