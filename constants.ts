import { SignData } from './types';

export const APP_CONFIG = {
  COUNTDOWN_SECONDS: 3,
  RECORDING_SECONDS: 3,
  API_SIMULATION_DELAY_MS: 1500,
};

export const AVAILABLE_SIGNS: SignData[] = [
  {
    id: 'oi',
    name: 'Oi',
    description: 'Levante o dedo mindinho (i) e faça um movimento circular junto ao rosto.',
    category: 'Cumprimentos',
    videoUrl: 'https://example.com/videos/oi.mp4'
  },
  {
    id: 'obrigado',
    name: 'Obrigado',
    description: 'Leve a mão à testa e mova-a para frente e para baixo em direção à pessoa.',
    category: 'Cumprimentos',
    videoUrl: 'https://example.com/videos/obrigado.mp4'
  },
  {
    id: 'bom-dia',
    name: 'Bom Dia',
    description: 'Mão em "D" na boca, movendo para frente, seguida de movimento de sol nascendo.',
    category: 'Cumprimentos',
    videoUrl: 'https://example.com/videos/bom-dia.mp4'
  },
  {
    id: 'familia',
    name: 'Família',
    description: 'Mãos em "F" fazendo um círculo horizontal à frente do corpo.',
    category: 'Família',
    videoUrl: 'https://example.com/videos/familia.mp4'
  },
  {
    id: 'amor',
    name: 'Amor',
    description: 'Mão plana sobre o peito, em movimento circular.',
    category: 'Sentimentos',
    videoUrl: 'https://example.com/videos/amor.mp4'
  }
];

export const UI_COLORS = {
  primary: '#461E52',
  secondary: '#DD517F',
  success: '#2ECC71',
  error: '#E74C3C',
  background: '#F5F6FA',
  textStrong: '#1C1C1C',
  textSecondary: '#707070'
};
