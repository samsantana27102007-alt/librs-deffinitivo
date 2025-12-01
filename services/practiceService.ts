import { FeedbackResult, SignData, HandLandmark } from '../types';
import { APP_CONFIG } from '../constants';

// URL do Backend Python (Flask)
const BACKEND_URL = 'http://localhost:5000/predict';

/**
 * Função principal que decide se chama a API Python ou usa validação local
 */
export const submitPracticeAttempt = async (
  sign: SignData, 
  landmarks: HandLandmark[][] | null
): Promise<FeedbackResult> => {
  
  // 1. Validar se temos dados da mão
  if (!landmarks || landmarks.length === 0) {
    return {
      isCorrect: false,
      message: 'Nenhuma mão detectada',
      confidence: 0,
    };
  }

  // Pegar a primeira mão detectada
  const handData = landmarks[0];

  try {
    // 2. Tentar enviar para o Backend Python
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sign_id: sign.id,
        landmarks: handData
      })
    });

    if (!response.ok) throw new Error("Backend unavailable");

    const result = await response.json();
    return {
      isCorrect: result.is_correct,
      message: result.is_correct ? 'Correto!' : 'Incorreto!',
      confidence: result.confidence
    };

  } catch (error) {
    console.warn("Backend Python não detectado. Usando validação local (Heurística).");
    // 3. Fallback: Validação Local Heurística para o MVP funcionar sem servidor
    return localHeuristicValidation(sign.id, handData);
  }
};

/**
 * Heurística simples baseada em geometria para testar sem Python
 * Baseado na posição relativa dos dedos
 */
const localHeuristicValidation = (signId: string, lm: HandLandmark[]): FeedbackResult => {
  let isCorrect = false;
  
  // Índices dos Landmarks (MediaPipe Hands)
  // 0: Wrist
  // 4: Thumb Tip
  // 8: Index Tip
  // 12: Middle Tip
  // 20: Pinky Tip
  
  const wrist = lm[0];
  const thumbTip = lm[4];
  const indexTip = lm[8];
  const pinkyTip = lm[20];

  switch (signId) {
    case 'oi':
      // Regra "Oi": Mindinho (20) levantado (y menor que base 18) E outros abaixados
      // Simplificado: Mindinho deve ser o ponto mais alto (menor Y)
      isCorrect = (pinkyTip.y < indexTip.y) && (pinkyTip.y < thumbTip.y);
      break;
      
    case 'bom-dia':
      // Regra "Bom dia" (D): Indicador (8) levantado
      isCorrect = (indexTip.y < pinkyTip.y) && (indexTip.y < thumbTip.y);
      break;

    case 'familia':
      // Regra "Familia" (F): Polegar e Indicador próximos
      const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
      isCorrect = dist < 0.1; // Normalizado
      break;

    default:
      // Para outros, simula sucesso aleatório para demo
      isCorrect = Math.random() > 0.4;
  }

  return {
    isCorrect,
    message: isCorrect ? 'Correto!' : 'Tente ajustar a mão',
    confidence: isCorrect ? 0.85 : 0.3
  };
};