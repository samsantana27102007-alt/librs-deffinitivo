import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';
import { PracticeState, HandLandmarkerResult } from '../types';

interface CameraFeedProps {
  state: PracticeState;
  countdownValue: number;
  onLandmarksDetected?: (landmarks: HandLandmarkerResult) => void;
}

// Declaração global para evitar erros de TS já que carregamos via CDN
declare global {
  interface Window {
    vision: any;
  }
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ state, countdownValue, onLandmarksDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // Refs para controle do MediaPipe
  const handLandmarkerRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // 1. Inicializar MediaPipe
  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        const { HandLandmarker, FilesetResolver } = window.vision || {};
        
        if (!HandLandmarker || !FilesetResolver) {
          console.warn("MediaPipe script not loaded yet. Waiting...");
          return;
        }

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });

        setIsModelLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar MediaPipe:", error);
      }
    };

    // Pequeno delay para garantir que o script CDN carregou
    const timer = setTimeout(initMediaPipe, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Loop de Detecção e Desenho
  const predictWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = handLandmarkerRef.current;

    if (!video || !canvas || !landmarker || !isModelLoaded) return;

    if (video.videoWidth > 0 && video.videoHeight > 0) {
        // Ajustar tamanho do canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Espelhar contexto para desenho correto
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        let startTimeMs = performance.now();
        if (lastVideoTimeRef.current !== video.currentTime) {
            lastVideoTimeRef.current = video.currentTime;
            
            const results = landmarker.detectForVideo(video, startTimeMs);
            
            if (results.landmarks) {
                // Passar dados para o pai se estiver gravando
                if ((state === PracticeState.RECORDING) && onLandmarksDetected) {
                  onLandmarksDetected(results);
                }

                // Desenhar
                for (const landmarks of results.landmarks) {
                    drawConnectors(ctx, landmarks, HandCONNECTIONS, { color: "#DD517F", lineWidth: 3 });
                    drawLandmarks(ctx, landmarks, { color: "#461E52", lineWidth: 1, radius: 4 });
                }
            }
        }
        ctx.restore();
    }

    if (state !== PracticeState.IDLE && state !== PracticeState.FEEDBACK) {
        requestRef.current = requestAnimationFrame(predictWebcam);
    }
  };

  // 3. Inicializar Câmera e Loop
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
              setHasPermission(true);
              predictWebcam();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
      }
    };

    if (state !== PracticeState.IDLE && state !== PracticeState.FEEDBACK) {
      startCamera();
    } else {
        // Stop loop if idle
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state, isModelLoaded]); // Restart if state changes or model loads

  // Helpers de Desenho (Simplificado)
  const HandCONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // Polegar
    [0, 5], [5, 6], [6, 7], [7, 8], // Indicador
    [0, 9], [9, 10], [10, 11], [11, 12], // Médio
    [0, 13], [13, 14], [14, 15], [15, 16], // Anelar
    [0, 17], [17, 18], [18, 19], [19, 20], // Mindinho
    [5, 9], [9, 13], [13, 17] // Palma
  ];

  const drawConnectors = (ctx: CanvasRenderingContext2D, landmarks: any[], connections: number[][], style: any) => {
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.lineWidth;
      ctx.beginPath();
      for (const conn of connections) {
          const p1 = landmarks[conn[0]];
          const p2 = landmarks[conn[1]];
          ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
          ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
      }
      ctx.stroke();
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[], style: any) => {
      ctx.fillStyle = style.color;
      for (const p of landmarks) {
          ctx.beginPath();
          ctx.arc(p.x * ctx.canvas.width, p.y * ctx.canvas.height, style.radius, 0, 2 * Math.PI);
          ctx.fill();
      }
  };

  // Render States
  if (state === PracticeState.IDLE || state === PracticeState.FEEDBACK) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] bg-cameraInactive rounded-card flex flex-col items-center justify-center text-textSecondary border border-black/5">
        <div className="p-4 bg-white/60 rounded-full mb-3 shadow-sm">
          <Camera size={32} className="text-textSecondary" strokeWidth={1.5} />
        </div>
        <p className="font-medium text-body2">Câmera inativa</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] bg-errorBg rounded-card flex flex-col items-center justify-center text-error border border-error/20 p-6 text-center">
        <AlertCircle size={40} className="mb-3 opacity-80" strokeWidth={1.5} />
        <p className="font-bold text-body1 mb-1">Sem acesso à câmera</p>
        <p className="text-body2">Por favor, verifique as permissões do seu navegador.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-card overflow-hidden shadow-lg ring-1 ring-black/5 transform transition-all duration-300">
      
      {/* Video Element (Hidden logic, but playing) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-0"
      />

      {/* Canvas Layer - Where the video AND drawings appear */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Loading Overlay if Model not ready */}
      {!isModelLoaded && (
        <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center text-white">
           <Loader2 className="animate-spin mb-2" size={32} />
           <p>Carregando Inteligência Artificial...</p>
        </div>
      )}

      {/* Overlay: Countdown */}
      {state === PracticeState.COUNTDOWN && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 animate-in fade-in duration-200">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl animate-zoomIn mb-4">
            <span className="text-7xl font-bold text-primary font-sans leading-none pb-2">
              {countdownValue}
            </span>
          </div>
          <p className="text-white text-xl font-bold tracking-wide uppercase drop-shadow-md animate-pulse">Prepare-se</p>
        </div>
      )}

      {/* Overlay: Recording Indicator */}
      {state === PracticeState.RECORDING && (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-center z-10">
          <div className="bg-white/95 backdrop-blur-md px-6 py-2 rounded-full shadow-lg flex items-center gap-3 border border-secondary/30">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            <span className="text-base font-bold text-textStrong tracking-wide">GRAVANDO</span>
          </div>
        </div>
      )}
      
      {/* Active Recording Border */}
      <div className={`absolute inset-0 rounded-card pointer-events-none transition-all duration-300 ${state === PracticeState.RECORDING ? 'border-[8px] border-secondary/60 animate-pulse' : 'border-0 border-transparent'}`} />
    </div>
  );
};