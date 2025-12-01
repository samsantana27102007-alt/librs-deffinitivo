import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG, AVAILABLE_SIGNS } from './constants';
import { PracticeState, FeedbackResult, AppView, User, PracticeHistory, HandLandmarkerResult } from './types';
import { submitPracticeAttempt } from './services/practiceService';
import { storageService } from './services/storageService';

import { CameraFeed } from './components/CameraFeed';
import { Button } from './components/Button';
import { Header } from './components/Header';
import { SignIllustration } from './components/SignIllustration';
import { Dashboard } from './components/Dashboard';
import { AuthScreen } from './components/AuthScreen';
import { QuizMode } from './components/QuizMode';
import { SignSelect } from './components/SignSelect';
import { VideoPlayer } from './components/VideoPlayer';

import { Check, X, ArrowRight, RotateCcw, Home, Loader2, Zap } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Practice State
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [appState, setAppState] = useState<PracticeState>(PracticeState.IDLE);
  const [countdown, setCountdown] = useState(APP_CONFIG.COUNTDOWN_SECONDS);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  
  // Data State (Captured Landmarks)
  const capturedLandmarks = useRef<HandLandmarkerResult['landmarks'] | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const savedUser = storageService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setCurrentView(AppView.DASHBOARD);
    }
    setIsAuthChecking(false);
  }, []);

  // --- Auth Handlers ---
  const handleLoginSuccess = () => {
    const currentUser = storageService.getCurrentUser();
    setUser(currentUser);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCurrentView(AppView.AUTH);
  };

  // --- Navigation Helpers ---
  const navigateTo = (view: AppView) => {
    // Reset states when leaving practice
    setAppState(PracticeState.IDLE);
    setFeedback(null);
    setCurrentView(view);
  };

  // --- Practice Logic ---
  const currentSign = AVAILABLE_SIGNS[currentSignIndex];

  const handleSignChange = (signId: string) => {
    const idx = AVAILABLE_SIGNS.findIndex(s => s.id === signId);
    if (idx !== -1) {
      setCurrentSignIndex(idx);
      setAppState(PracticeState.IDLE);
      setFeedback(null);
    }
  };

  const startPractice = () => {
    setAppState(PracticeState.COUNTDOWN);
    setCountdown(APP_CONFIG.COUNTDOWN_SECONDS);
    setFeedback(null);
    capturedLandmarks.current = null; // Reset captured data
  };

  // Callback from CameraFeed whenever it sees a hand during recording
  const handleLandmarksDetected = useCallback((results: HandLandmarkerResult) => {
      // Store the latest detected landmarks
      if (results.landmarks && results.landmarks.length > 0) {
          capturedLandmarks.current = results.landmarks;
      }
  }, []);

  const processRecording = useCallback(async () => {
    setAppState(PracticeState.PROCESSING);
    
    // Send captured data to service (Python Backend or Local Heuristic)
    const result = await submitPracticeAttempt(currentSign, capturedLandmarks.current);
    
    // Save to History (Mock DB)
    if (user) {
      const historyItem: PracticeHistory = {
        signId: currentSign.id,
        timestamp: Date.now(),
        isCorrect: result.isCorrect,
        mode: 'PRACTICE'
      };
      storageService.saveAttempt(historyItem);
    }

    setFeedback(result);
    setAppState(PracticeState.FEEDBACK);
  }, [currentSign, user]);

  const nextSign = () => {
    setCurrentSignIndex((prev) => (prev + 1) % AVAILABLE_SIGNS.length);
    setAppState(PracticeState.IDLE);
    setFeedback(null);
  };

  const retrySign = () => {
    setFeedback(null);
    setAppState(PracticeState.COUNTDOWN);
    setCountdown(APP_CONFIG.COUNTDOWN_SECONDS);
    capturedLandmarks.current = null;
  };

  // --- Effects for Practice Mode ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (appState === PracticeState.COUNTDOWN) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setAppState(PracticeState.RECORDING);
      }
    }
    return () => clearTimeout(timer);
  }, [appState, countdown]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (appState === PracticeState.RECORDING) {
      timer = setTimeout(() => {
        processRecording();
      }, APP_CONFIG.RECORDING_SECONDS * 1000);
    }
    return () => clearTimeout(timer);
  }, [appState, processRecording]);

  // --- Helper for Instructions ---
  const renderInstructionBar = () => {
    switch (appState) {
      case PracticeState.IDLE:
        return (
          <p className="text-textSecondary font-medium">
            Clique em "Iniciar Prática" quando estiver pronto.
          </p>
        );
      case PracticeState.COUNTDOWN:
        return (
          <div className="flex items-center gap-3 text-primary animate-pulse">
            <span className="text-lg font-bold">Prepare-se...</span>
          </div>
        );
      case PracticeState.RECORDING:
        return (
          <div className="flex items-center gap-3 text-secondary animate-pulse">
             <div className="w-3 h-3 rounded-full bg-secondary"></div>
             <span className="text-xl font-bold tracking-wide uppercase">Faça o sinal agora!</span>
          </div>
        );
      case PracticeState.PROCESSING:
        return (
          <div className="flex items-center gap-3 text-primary">
            <Loader2 className="animate-spin" size={20} />
            <span className="font-semibold">Analisando movimento...</span>
          </div>
        );
      case PracticeState.FEEDBACK:
        return null;
      default:
        return null;
    }
  };

  if (isAuthChecking) return null;

  if (!user || currentView === AppView.AUTH) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-textStrong flex flex-col selection:bg-secondary/20">
      <Header />
      
      {currentView === AppView.DASHBOARD && (
        <Dashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} />
      )}

      {currentView === AppView.QUIZ && (
        <QuizMode onBack={() => navigateTo(AppView.DASHBOARD)} />
      )}

      {currentView === AppView.PRACTICE && (
        <main className="flex-1 w-full max-w-[680px] mx-auto px-mobile-gap md:px-desktop-gap py-vertical-gap flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-6">
            <button 
              onClick={() => navigateTo(AppView.DASHBOARD)} 
              className="text-textSecondary hover:text-primary flex items-center gap-2 font-medium"
            >
              <Home size={18} />
              Home
            </button>
            <SignSelect 
              signs={AVAILABLE_SIGNS} 
              currentSignId={currentSign.id} 
              onChange={handleSignChange} 
            />
          </div>

          <div className="text-center w-full mb-6">
            <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full mb-2">
              {currentSign.category}
            </span>
            <h1 className="text-h1 text-primary mb-3">
              {currentSign.name}
            </h1>
            <p className="text-textSecondary text-body1 max-w-md mx-auto leading-relaxed">
              {currentSign.description}
            </p>
          </div>

          <div className="w-full mb-4 relative">
            {appState === PracticeState.FEEDBACK && feedback ? (
              <div className="flex flex-col gap-6 animate-slideUp">
                
                <div className={`w-full rounded-card flex flex-col items-center justify-center p-10 border-2 shadow-lg transition-all duration-300 ${feedback.isCorrect ? 'bg-successBg border-success/30' : 'bg-errorBg border-error/30'}`}>
                  
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transform transition-transform animate-[zoomIn_0.4s_ease-out] ${feedback.isCorrect ? 'bg-success text-white shadow-success/40 shadow-xl' : 'bg-error text-white shadow-error/40 shadow-xl'}`}>
                    {feedback.isCorrect ? <Check size={48} strokeWidth={4} /> : <X size={48} strokeWidth={4} />}
                  </div>
                  
                  <h2 className={`text-[32px] font-bold mb-3 tracking-tight ${feedback.isCorrect ? 'text-success' : 'text-error'}`}>
                    {feedback.message}
                  </h2>
                  
                  <p className="text-textSecondary text-lg text-center font-medium max-w-xs">
                    {feedback.isCorrect 
                      ? "Movimento perfeito! Você acertou." 
                      : "Movimento não reconhecido. Tente ajustar a posição da mão."}
                  </p>
                </div>

                {!feedback.isCorrect && (
                  <div className="w-full bg-white p-6 rounded-card border border-gray-200 shadow-md">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Zap size={20} fill="currentColor" className="text-secondary" />
                        <p className="text-sm font-bold uppercase tracking-wider">Veja como fazer corretamente</p>
                    </div>
                    <VideoPlayer signName={currentSign.name} videoUrl={currentSign.videoUrl} />
                  </div>
                )}
              </div>
            ) : (
              <>
                 {appState === PracticeState.IDLE ? (
                    <div className="w-full aspect-square md:aspect-[4/3] flex items-center justify-center bg-white rounded-card border-2 border-dashed border-gray-200 shadow-sm mb-4">
                       <SignIllustration signId={currentSign.id} />
                    </div>
                 ) : (
                    <CameraFeed 
                      state={appState} 
                      countdownValue={countdown} 
                      onLandmarksDetected={handleLandmarksDetected}
                    />
                 )}
              </>
            )}
          </div>

          <div className="w-full h-16 flex items-center justify-center mb-4 bg-white/50 backdrop-blur-sm rounded-xl">
             {renderInstructionBar()}
          </div>

          <div className="w-full mt-auto pb-8">
            {appState === PracticeState.IDLE && (
              <Button onClick={startPractice} className="shadow-lg shadow-primary/20">
                Iniciar Prática
              </Button>
            )}

            {(appState === PracticeState.COUNTDOWN || appState === PracticeState.RECORDING || appState === PracticeState.PROCESSING) && (
               <Button disabled isLoading={appState === PracticeState.PROCESSING} variant="secondary" className="bg-white">
                  {appState === PracticeState.PROCESSING ? 'Processando' : 'Cancelar'}
               </Button>
            )}

            {appState === PracticeState.FEEDBACK && (
              <div className="flex flex-col gap-4 w-full">
                {feedback?.isCorrect ? (
                  <Button onClick={nextSign} className="gap-2 shadow-lg shadow-success/20 bg-success hover:bg-success/90">
                    Próximo Sinal <ArrowRight size={20} />
                  </Button>
                ) : (
                  <Button onClick={retrySign} variant="primary" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                    Tentar Novamente <RotateCcw size={20} />
                  </Button>
                )}
                
                <div className="flex justify-center pt-1">
                   {!feedback?.isCorrect && (
                     <button 
                       onClick={nextSign} 
                       className="text-sm font-semibold text-textSecondary hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-gray-100"
                     >
                       Pular para o próximo
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}