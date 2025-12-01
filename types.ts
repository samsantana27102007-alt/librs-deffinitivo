export enum PracticeState {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  FEEDBACK = 'FEEDBACK'
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  PRACTICE = 'PRACTICE',
  QUIZ = 'QUIZ'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PracticeHistory {
  signId: string;
  timestamp: number;
  isCorrect: boolean;
  mode: 'PRACTICE' | 'QUIZ';
}

export interface SignData {
  id: string;
  name: string;
  description: string;
  category: string;
  illustrationPath?: string; 
  videoUrl?: string; // URL for the correction video
}

export interface FeedbackResult {
  isCorrect: boolean;
  message: string;
  confidence: number;
}

// MediaPipe Types
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandLandmarkerResult {
  landmarks: HandLandmark[][];
  worldLandmarks: HandLandmark[][];
  handedness: any[];
}