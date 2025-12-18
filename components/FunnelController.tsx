import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Progress } from "./ui/Progress";
import { Badge } from "./ui/Badge";
import { BonusModal } from "./BonusModal";
import { MatrixRain } from "./MatrixRain";
import { Skull, Zap, Target, Brain, Flame, Plus, Bot, DollarSign, Crosshair, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { UserProfile } from "../types";
import { QUESTIONS } from "../constants";
import { playSound, initializeDarkAudio, playDarkAudio, playTrack } from "../utils/audio";

const CHECKOUT_URL = "https://pay.cakto.com.br/ryddo72_692021";

const XPNotification = ({ show, points }: { show: boolean; points: number }) => {
  if (!show) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] animate-bounce">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg border border-red-400">
        <Plus className="w-5 h-5 mr-2" />+{points} XP
      </div>
    </div>
  );
};

// Reusable Layout for Questions to match the reference design exactly
const QuestionLayout = ({ 
  missionTitle, 
  xp, 
  questionText, 
  options, 
  onAnswer, 
  selectedOption,
  layout = "list",
  image
}: {
  missionTitle: string;
  xp: number;
  questionText: string;
  options: string[];
  onAnswer: (index: number) => void;
  selectedOption: number | null;
  layout?: "list" | "grid-2";
  image?: string;
}) => {
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative z-10 font-mono pt-24 sm:pt-28">
      {/* Header - Reference Style */}
      <div className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-start z-40 pointer-events-none">
        <div className="flex items-center gap-2 text-red-500 font-bold tracking-widest text-sm sm:text-base md:text-lg bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-red-500/20">
          <Crosshair className="w-5 h-5 sm:w-6 sm:h-6 animate-[spin_10s_linear_infinite]" />
          <span>{missionTitle}</span>
        </div>
        <div className="border border-red-500 rounded-full px-4 py-1 text-red-500 text-xs sm:text-sm font-bold bg-black/50 backdrop-blur-sm shadow-[0_0_10px_rgba(239,68,68,0.3)]">
          XP: {xp}
        </div>
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-4xl bg-black border-2 border-red-500 rounded-3xl p-6 sm:p-10 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
           {/* Decorative corner lines inside card */}
           <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500/50 rounded-tl-lg"></div>
           <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500/50 rounded-tr-lg"></div>
           <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500/50 rounded-bl-lg"></div>
           <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500/50 rounded-br-lg"></div>

          <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-6 sm:mb-8 leading-tight font-mono text-center sm:text-left">
            {questionText}
          </h2>

          {image && (
            <div className="mb-8 flex justify-center">
              <div className="relative group max-w-[300px] sm:max-w-sm w-full">
                <div className="absolute -inset-1 bg-red-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src={image} 
                  alt="Scenario" 
                  className="relative rounded-xl border border-red-500/30 w-full h-auto object-cover shadow-2xl"
                />
              </div>
            </div>
          )}

          <div className={`${layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-3 sm:gap-4'}`}>
            {options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isOtherSelected = selectedOption !== null && !isSelected;
              
              return (
                <button
                  key={index}
                  onClick={() => onAnswer(index)}
                  disabled={selectedOption !== null}
                  className={`group w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-base sm:text-lg font-bold relative overflow-hidden
                    ${isSelected 
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-[1.01]' 
                      : 'border-red-500/40 text-white hover:bg-red-500 hover:text-white hover:border-red-500'}
                    ${isOtherSelected ? 'opacity-50 grayscale' : ''}
                    ${layout === 'grid-2' ? 'justify-center text-center' : ''}
                  `}
                >
                  {/* Show letters A, B, C, D, E */}
                  {layout !== 'grid-2' && <span className="shrink-0 text-red-500 group-hover:text-white transition-colors">{letters[index]}.</span>}
                  <span className="leading-tight">{option}</span>
                  {/* Subtle hover glow effect */}
                  {!selectedOption && (
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FunnelController() {
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    xp: 0,
    level: 1,
    answers: [],
    psychProfile: "",
    isElite: false,
  });
  const [showXP, setShowXP] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const vslVideoRef = useRef<HTMLVideoElement>(null);
  const [hasShownBonusModal, setHasShownBonusModal] = useState(false);

  // Audio helpers mapped to user's logic
  const playCoringaAudio = () => playTrack("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coringaOlhadireito-86R9IRadwB1LxuYmRSquxNv487q8Yg.wav");
  const playRisadaFantasmaAudio = () => playTrack("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/risadafantasma-FnIfHYOOKwunrsXFxjOPTrfh1CISdZ.wav", 0.7);
  const playAtiveAgoraAudio = () => playTrack("/images/coringa-ativeagora.wav", 0.7);
  const playCoringaOuVoceVendeAudio = () => playTrack("/images/coringa-ouvocevende.wav");
  const playCoringaVoceSeLeuAudio = () => playTrack("/images/coringa-voceseleu.mp3");
  const playOcaduDoBlackAudio = () => playTrack("/images/coringa-ocadudoblack.wav", 0.7);
  const playCoringaVoceMereceAudio = () => playTrack("/images/5bcoringa-5dvocemerece.mp3", 0.7);
  const playDoorOpeningAudio = () => playTrack("/door-opening.mp3", 0.7);

  useEffect(() => {
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Forced Autoplay logic for Step 13 (VSL)
    if (currentStep === 13) {
      // Play intro audio immediately for VSL step
      playTrack("https://asuavidabela.online/wp-content/uploads/2025/12/CoringaPare-.ersa_.mp3", 0.8);
      
      if (vslVideoRef.current) {
        vslVideoRef.current.play().catch(err => {
          console.log("Autoplay failed, attempting muted autoplay", err);
          if (vslVideoRef.current) {
            vslVideoRef.current.muted = true;
            vslVideoRef.current.play();
          }
        });
      }
    }

    // Play presentation audio immediately when reaching step 5
    if (currentStep === 5) {
      playTrack("https://asuavidabela.online/wp-content/uploads/2025/12/CoringaA-Cai.co_.__.mp3", 0.8);
    }

    // Play ghost laughter audio immediately when reaching step 7 (Question 6)
    if (currentStep === 7) {
      playRisadaFantasmaAudio();
    }
  }, [currentStep]);

  useEffect(() => {
    initializeDarkAudio();
  }, []);

  // Modal logic hook
  useEffect(() => {
    if (currentStep === 16 && !hasShownBonusModal) {
      setShowBonusModal(true);
      setHasShownBonusModal(true);
    } else if (currentStep !== 16) {
      setShowBonusModal(false);
    }
  }, [currentStep, hasShownBonusModal]);

  const addXP = (points: number) => {
    setUserProfile((prev) => {
      const newXP = prev.xp + points;
      let newLevel = Math.floor(newXP / 100) + 1;
      if (newLevel > 20) newLevel = 20;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1000);
  };

  const updateFinalXP = () => {
    setUserProfile((prev) => ({
      ...prev,
      xp: 1950,
      level: 20,
      classification: "MANIPULADOR NATO",
    }));
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1000);
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const question = QUESTIONS[questionIndex];
    if (!question) return;

    setSelectedOption(answerIndex);

    const newAnswers = [...userProfile.answers, question.options[answerIndex]];

    setUserProfile((prev) => ({
      ...prev,
      answers: newAnswers,
    }));

    addXP(25);
    playSound("click");

    // Audio triggers based on index (additional to the immediate entry triggers)
    if (questionIndex === 3) playOcaduDoBlackAudio();
    if (questionIndex === 8) playAtiveAgoraAudio();

    // Transition
    setTimeout(() => {
      const nextStepVal = currentStep + 1;
      if (nextStepVal > 1) playSound("transition");
      
      setTimeout(() => {
          setSelectedOption(null);
          if (nextStepVal < 16) setCurrentStep(nextStepVal);
      }, 400); 
    }, 0); 
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    playSound("transition");
    addXP(50);
  };

  const analyzeProfile = () => {
    setAnalysisProgress(0);
    const timer = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          const profiles = ["PREDADOR DIGITAL", "MANIPULADOR NATO", "DOMINADOR BLACK", "VENDEDOR SOMBRIO"];
          setUserProfile((prev) => ({
            ...prev,
            psychProfile: profiles[Math.floor(Math.random() * profiles.length)],
            isElite: true,
          }));
          setTimeout(() => {
            playSound("success");
            setCurrentStep(15);
          }, 1500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const getQuestionNumber = (step: number) => {
    if (step >= 1 && step <= 4) return step;
    if (step >= 6 && step <= 7) return step - 1; 
    if (step === 9) return 7;
    if (step >= 11 && step <= 12) return step - 3; 
    return 1;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-6 z-10 pt-20">
            <div className="text-center z-10 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl w-full">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white leading-tight font-mono">
                Descubra os Scripts Psicológicos que Transformam Qualquer Conversa Chata em um <span className="underline decoration-2 underline-offset-4">Encontro sem Esforço</span>
              </div>
              <div className="mb-6 sm:mb-8 flex justify-center">
                 <img src="https://i.imgur.com/4YBrHEz.png" alt="Preview" className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] h-auto object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
              </div>
              <div className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-red-500/30 text-red-300 font-mono">
                {"Revele a Caixa Preta do Flerte e veja como transformar suas conversas em encontros reais..."}
              </div>
              <Button
                onClick={() => {
                  playDarkAudio();
                  playCoringaAudio();
                  playSound("transition");
                  addXP(50);
                  setCurrentStep(1);
                }}
                className="bg-red-600 text-white hover:bg-red-500 text-lg sm:text-xl md:text-2xl px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 w-full shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 font-bold min-h-[70px] whitespace-normal leading-tight font-mono rounded-xl hover:scale-105"
              >
                COMEÇAR
              </Button>
            </div>
          </div>
        );

      case 1:
      case 2:
      case 3:
      case 4:
        const qIdx1 = currentStep - 1;
        const isYesNo = currentStep === 2;
        return (
          <QuestionLayout
            missionTitle={`MISSÃO ${getQuestionNumber(currentStep)}/9`}
            xp={userProfile.xp}
            questionText={QUESTIONS[qIdx1].text}
            options={QUESTIONS[qIdx1].options}
            onAnswer={(idx) => handleAnswer(qIdx1, idx)}
            selectedOption={selectedOption}
            layout={isYesNo ? "grid-2" : "list"}
          />
        );

      case 5:
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 pt-20">
            <div className="w-full max-w-4xl p-5 sm:p-9 bg-black border-2 border-red-500 rounded-3xl shadow-[0_0_30px_rgba(239,68,68,0.15)] z-10">
              <div className="text-center">
                <span className="w-16 h-16 mx-auto mb-4 text-red-500 drop-shadow-lg flex items-center justify-center">
                   <Skull className="w-full h-full" />
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight font-mono">
                  APRESENTAÇÃO DO PRODUTO
                </h2>
                <div className="bg-red-900/10 p-5 rounded-xl border border-red-500/30 mb-6 shadow-inner">
                  <div className="text-red-500 font-mono text-sm sm:text-base mb-4 opacity-80">[BRIEFING PSICOLÓGICO INICIADO]</div>
                  <p className="text-base sm:text-xl lg:text-2xl leading-relaxed text-red-300 font-mono">
                    A CAIXA PRETA DO FLERTE faz a atração acontecer sem você se provar, impressionar ou aparecer — só controle psicológico.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 font-mono">
                  <div className="flex items-center gap-3 text-white p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <Zap className="w-6 h-6 flex-shrink-0 text-red-400" />
                    <span className="font-medium text-left">Dominação total para nunca mais ser ignorado.</span>
                  </div>
                  <div className="flex items-center gap-3 text-white p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <Target className="w-6 h-6 flex-shrink-0 text-red-400" />
                    <span className="font-medium text-left">Direção psicológica para você sempre vai prender a atenção dela e fazê-la responder rápido.</span>
                  </div>
                </div>
                <Button onClick={nextStep} className="bg-red-600 text-white hover:bg-red-500 text-lg sm:text-2xl px-8 py-5 w-full shadow-lg shadow-red-500/25 transition-all duration-300 font-bold min-h-[76px] rounded-xl font-mono">
                  CONTINUAR
                </Button>
              </div>
            </div>
          </div>
        );

      case 6:
      case 7:
        const microIdx = currentStep - 6;
        const qIdx2 = 4 + microIdx;
        return (
          <QuestionLayout
            missionTitle={`MISSÃO ${getQuestionNumber(currentStep)}/9`}
            xp={userProfile.xp}
            questionText={QUESTIONS[qIdx2].text}
            options={QUESTIONS[qIdx2].options}
            onAnswer={(idx) => handleAnswer(qIdx2, idx)}
            selectedOption={selectedOption}
            image={qIdx2 === 4 ? "https://cdn.xquiz.co/images/43975964-fbe0-4c0a-bd6a-8edd4d44ec10" : undefined}
          />
        );

      case 8:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 font-mono pt-20">
            <Card className="w-full max-w-4xl p-6 md:p-9 bg-black border-2 border-red-500 rounded-3xl z-10">
              <div className="text-center">
                <div className="text-6xl mb-5">🕷️</div>
                <div className="text-3xl font-bold mb-6 text-red-500 glitch font-mono" data-text="BÔNUS DESBLOQUEADO">BÔNUS DESBLOQUEADO</div>
                
                <div className="grid gap-4 mb-10 text-left max-h-[60vh] overflow-y-auto pr-2">
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-start gap-4 text-red-400 mb-2">
                      <span className="text-lg">🧠</span>
                      <span className="text-lg font-bold">1000 Scripts Psicológicos</span>
                    </div>
                    <p className="text-sm text-red-300 ml-8">Não perca tempo quebrando a cabeça pensando no que dizer, copie e cole um dos Scripts Psicológicos e veja ela responder na hora.</p>
                  </div>
                  
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-start gap-4 text-red-400 mb-2">
                      <span className="text-lg">🤖</span>
                      <span className="text-lg font-bold">Bot do Flerte</span>
                    </div>
                    <p className="text-sm text-red-300 ml-8">Uma IA avançada que cria mensagens irresistível em segundos, para fazer qualquer mulher ficar hipnotizada nas suas conversas e pensar em você o dia todo, sem esforço.</p>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-start gap-4 text-red-400 mb-2">
                      <span className="text-lg">👤</span>
                      <span className="text-lg font-bold">Perfil que atraí Mulheres</span>
                    </div>
                    <p className="text-sm text-red-300 ml-8">O segredo para deixar seu perfil do Tinder e Instagram irresistíveis para qualquer mulher.</p>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-start gap-4 text-red-400 mb-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-lg font-bold">Como ir do "Oi ao Sexo" no primeiro encontro</span>
                    </div>
                    <p className="text-sm text-red-300 ml-8">Use esses gatilhos de conversa que ativam tesão feminino e transformam qualquer encontro em oportunidade de real de sexo, sem forçar nada.</p>
                  </div>
                </div>

                <Button onClick={() => { playSound("success"); playCoringaVoceMereceAudio(); addXP(500); setCurrentStep(9); }} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 text-white font-bold py-7 text-xl shadow-lg rounded-xl animate-pulse font-mono">CONTINUAR PARA O FILTRO</Button>
              </div>
            </Card>
          </div>
        );

      case 9:
        const eliteQuestion = QUESTIONS[6];
        return (
           <div className="min-h-screen flex flex-col p-4 sm:p-6 relative z-10 font-mono pt-24 sm:pt-28">
            <div className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-start z-40 pointer-events-none">
              <div className="flex items-center gap-2 text-red-500 font-bold tracking-widest text-sm sm:text-base md:text-lg bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-red-500/20">
                <Target className="w-6 h-6 animate-pulse" />
                <span>FILTRO DE ELITE</span>
              </div>
              <div className="border border-red-500 rounded-full px-4 py-1 text-red-500 text-sm font-bold bg-black/50 backdrop-blur-sm shadow-[0_0_10px_rgba(239,68,68,0.3)]">XP: {userProfile.xp}</div>
            </div>
            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-full max-w-4xl bg-black border-2 border-red-500 rounded-3xl p-6 sm:p-10 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                <h2 className="text-2xl sm:text-4xl text-white font-bold mb-4 leading-tight font-mono">{eliteQuestion.text}</h2>
                <p className="text-red-400 mb-8 font-mono text-sm uppercase tracking-widest">⚠️ Se não escolher "SOU PEGADOR", IA bloqueia e mostra tela de humilhação.</p>
                <div className="flex flex-col gap-4">
                  {eliteQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isOptionD = index === 3;
                    
                    let buttonClasses = `group w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-lg font-bold relative overflow-hidden
                      ${isOptionD 
                        ? 'border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:bg-green-600/10' 
                        : 'border-red-500/40 text-white hover:bg-red-500'}
                      ${isSelected ? (isOptionD ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-red-600 border-red-500') : ''}
                      ${selectedOption !== null && !isSelected ? 'opacity-50 grayscale' : ''}
                    `;

                    return (
                      <button 
                        key={index} 
                        disabled={selectedOption !== null} 
                        onClick={() => {
                          setSelectedOption(index);
                          if (isOptionD) {
                            addXP(25); 
                            playSound("click");
                            setTimeout(() => { 
                              setSelectedOption(null); 
                              setCurrentStep(10); 
                              playSound("transition"); 
                            }, 400);
                          } else {
                            playSound("error");
                            setTimeout(() => { 
                              setSelectedOption(null); 
                              setCurrentStep(18); 
                            }, 1000);
                          }
                        }} 
                        className={buttonClasses}
                      >
                        <span className={`shrink-0 ${isOptionD ? 'text-green-500 group-hover:text-white' : 'text-red-500 group-hover:text-white'}`}>
                          {['A','B','C','D'][index]}.
                        </span>
                        <span>{option}</span>
                        {isOptionD && <Zap className="w-5 h-5 ml-auto text-green-500 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 font-mono pt-20">
             <Card className="w-full max-w-4xl p-8 bg-black border-2 border-red-500 rounded-3xl z-10">
               <h2 className="text-center text-3xl font-bold mb-8 text-red-500 font-mono">DEPOIMENTOS</h2>
               <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-red-900/5 p-6 rounded-xl border border-red-500/20 text-center">
                    <img src="https://cdn.xquiz.co/images/65edb7b2-c0c2-441c-8b09-52ba1e0f2a8f" alt="Depoimento 1" className="w-full h-auto mb-4 rounded border border-red-500/10 shadow-lg shadow-red-500/5" />
                    <p className="text-red-400 font-mono">- Operador Anônimo #127</p>
                 </div>
                 <div className="bg-red-900/5 p-6 rounded-xl border border-red-500/20 text-center">
                    <img src="https://cdn.xquiz.co/images/b92ff8fe-4697-42d2-bc81-8cd2f50a9601" alt="Depoimento 2" className="w-full h-auto mb-4 rounded border border-red-500/10 shadow-lg shadow-red-500/5" />
                    <p className="text-red-400 font-mono">- Operador Anônimo #450</p>
                 </div>
               </div>
               <Button onClick={nextStep} className="w-full py-6 text-xl font-bold bg-red-600 text-white rounded-xl hover:bg-red-500 font-mono">CONTINUAR</Button>
             </Card>
            </div>
        )
      
      case 11:
      case 12:
        const finalIdx = currentStep - 11;
        const qIdx3 = 7 + finalIdx;
        return (
          <QuestionLayout
            missionTitle={`MISSÃO ${getQuestionNumber(currentStep)}/9`}
            xp={userProfile.xp}
            questionText={QUESTIONS[qIdx3].text}
            options={QUESTIONS[qIdx3].options}
            onAnswer={(idx) => handleAnswer(qIdx3, idx)}
            selectedOption={selectedOption}
          />
        );

      case 13:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 font-mono pt-20">
            <Card className="w-full max-w-4xl p-6 bg-black border-2 border-red-500 rounded-3xl z-10 mt-12 overflow-hidden">
              <div className="text-center">
                <div className="text-red-400 text-xl mb-6 font-mono animate-pulse">{">"} CaixaPretaDoFlerte.EXE iniciando...|</div>
                <div className="mx-auto mb-8 bg-black border border-red-500/30 rounded-2xl aspect-[9/16] max-w-[400px] w-full relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <video 
                    ref={vslVideoRef}
                    src="https://asuavidabela.online/wp-content/uploads/2025/12/videodevendas.mp4"
                    className="w-full h-full object-contain pointer-events-none"
                    autoPlay
                    loop
                    playsInline
                    style={{ WebkitTouchCallout: 'none' }}
                  />
                  <div className="absolute inset-0 z-10 bg-transparent"></div>
                </div>
                <h2 className="text-3xl font-bold mb-8 text-white font-mono uppercase">CAIXA PRETA DO FLERTE</h2>
                
                <div className="mb-8 flex justify-center">
                   <div className="relative group w-full max-w-[1080px]">
                      <div className="absolute -inset-1 bg-red-500/10 rounded-2xl blur-lg opacity-50"></div>
                      <img 
                        src="https://vidamelhormagnetica.shop/wp-content/uploads/2024/11/Mandando-Cantadas-prontas-3.png" 
                        alt="Estratégias de Flerte" 
                        className="relative w-full h-auto rounded-xl border border-red-500/20 shadow-2xl object-cover"
                      />
                   </div>
                </div>

                <button onClick={() => { playSound("success"); addXP(1000); setCurrentStep(14); }} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-5 rounded-xl text-xl shadow-lg shadow-red-500/20 font-mono">🔥 LIBERAR ACESSO CLANDESTINO AGORA</button>
              </div>
            </Card>
          </div>
        );

      case 14:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 font-mono pt-20">
            <Card className="w-full max-w-3xl p-8 bg-black border-2 border-red-500 rounded-3xl z-10 text-center">
                <div className="text-3xl font-bold mb-8 text-red-500 font-mono">ANÁLISE DE PERFIL PSICOLÓGICO</div>
                <Progress value={analysisProgress} className="mb-4 h-5 bg-gray-900 rounded-full" />
                <div className="text-xl font-mono px-4 min-h-[32px] text-red-300">
                    {analysisProgress < 100 ? "Escaneando padrões comportamentais..." : "ANÁLISE COMPLETA"} {analysisProgress > 0 && `${analysisProgress}%`}
                </div>
                {analysisProgress === 0 && (
                  <Button onClick={analyzeProfile} className="bg-red-600 text-white hover:bg-red-500 text-2xl px-10 py-6 w-full font-bold rounded-xl mt-8">INICIAR ANÁLISE</Button>
                )}
            </Card>
          </div>
        );

      case 15:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 font-mono pt-20 text-center">
            <Card className="w-full max-w-4xl p-8 md:p-12 bg-black border-2 border-red-500 rounded-3xl z-10 mt-12 backdrop-blur-sm shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <div className="space-y-6 mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-red-500 font-mono uppercase tracking-tighter">🏆 PERFIL CONCLUÍDO!</h2>
                  <div className="space-y-2">
                    <p className="text-xl md:text-2xl text-white font-bold">Você passou pela análise do Sistema Flerte.</p>
                    <p className="text-lg md:text-xl text-red-400">Agora tem acesso aos bastidores do jogo real.</p>
                  </div>
                </div>

                <div className="bg-red-900/5 border border-red-500/20 rounded-2xl p-6 md:p-8 mb-10 text-left space-y-4">
                  {[
                    "Acesso liberado à Caixa Preta do Flerte",
                    "Perfil psicológico mapeado. Estratégia personalizada pronta",
                    "Status Operador confirmado"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                      <span className="text-green-400 text-lg md:text-xl font-bold italic">{item}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => { playSound("success"); playDoorOpeningAudio(); updateFinalXP(); setCurrentStep(16); }} 
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-7 text-2xl font-mono shadow-[0_0_30px_rgba(239,68,68,0.5)] rounded-xl animate-pulse uppercase"
                >
                  RESGATAR MEU ACESSO
                </Button>
            </Card>
          </div>
        );

      case 16:
        return (
          <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center p-4 relative z-10 pt-24 pb-20">
            <div className="w-full max-w-5xl space-y-12">
              
              {/* Header Section */}
              <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-red-500 tracking-tighter uppercase leading-none">
                  OS SCRIPTS ESTÃO PRONTOS, VOCÊ SÓ ENVIA…
                </h1>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-3xl font-bold text-white uppercase italic">
                    Ative agora a Caixa Preta do Flerte
                  </h3>
                  <p className="text-red-400 text-lg md:text-xl font-bold flex items-center justify-center gap-2">
                    Use no Instagram, Whatsapp ou Tinder 🔥
                  </p>
                </div>
              </div>

              {/* Main Image */}
              <div className="flex justify-center">
                <div className="relative group max-w-md w-full">
                  <div className="absolute -inset-2 bg-red-500/30 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
                  <img 
                    src="https://cdn.xquiz.co/images/05897c35-1c3d-4d44-937f-3fb1d04efb48" 
                    alt="Caixa Preta Deliverables" 
                    className="relative rounded-2xl border-2 border-red-500/40 w-full shadow-2xl"
                  />
                </div>
              </div>

              {/* Deliverables Section */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-red-500 border-b-2 border-red-500 inline-block pb-2 mb-6">
                    [ENTREGÁVEIS + BÔNUS]
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-red-900/5 border-red-500/30">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-2 uppercase">Dominação Total</h4>
                        <p className="text-red-200 text-sm">Aprenda a ser notado e nunca mais seja ignorado nas notificações delas.</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-red-900/5 border-red-500/30">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-2 uppercase">Direção Psicológica</h4>
                        <p className="text-red-200 text-sm">Prenda a atenção dela e faça-a responder em segundos com técnicas de urgência.</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Bonus Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-4 text-red-400 mb-3">
                      <Brain className="w-8 h-8" />
                      <span className="text-lg font-black uppercase">1000 Scripts Psicológicos</span>
                    </div>
                    <p className="text-sm text-red-300">Não perca tempo pensando no que dizer, copie e cole e veja ela responder na hora.</p>
                  </div>
                  
                  <div className="p-5 bg-black border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-4 text-red-400 mb-3">
                      <Bot className="w-8 h-8" />
                      <span className="text-lg font-black uppercase">Bot do Flerte</span>
                    </div>
                    <p className="text-sm text-red-300">IA avançada que cria mensagens irresistíveis para fazê-la pensar em você o dia todo.</p>
                  </div>

                  <div className="p-5 bg-black border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-4 text-red-400 mb-3">
                      <Target className="w-8 h-8" />
                      <span className="text-lg font-black uppercase">Perfil Imã de Mulheres</span>
                    </div>
                    <p className="text-sm text-red-300">O segredo para deixar seu Tinder e Instagram irresistíveis para qualquer mulher.</p>
                  </div>

                  <div className="p-5 bg-black border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-4 text-red-400 mb-3">
                      <Flame className="w-8 h-8" />
                      <span className="text-lg font-black uppercase">Do Oi ao Sexo</span>
                    </div>
                    <p className="text-sm text-red-300">Gatilhos que ativam o tesão feminino e transformam encontros em oportunidades reais.</p>
                  </div>
                </div>
              </div>

              {/* Social Proof / Results */}
              <div className="space-y-8 pt-10">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest flex items-center justify-center gap-4">
                    ALGUNS RESULTADOS 👇
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: "#345", img: "https://cdn.xquiz.co/images/7d2a5acf-452c-4bf8-91c8-a0a09ec3e002" },
                    { id: "#677", img: "https://cdn.xquiz.co/images/b6966776-38f9-4a53-94b6-ffe4e3dd72a9" },
                    { id: "#014", img: "https://cdn.xquiz.co/images/b7b01951-6a90-48d3-812b-e9e379be0118" }
                  ].map((dep, i) => (
                    <Card key={i} className="p-4 bg-red-900/5 border-red-500/20">
                      <img src={dep.img} alt={`Resultado ${dep.id}`} className="w-full h-auto rounded-lg mb-4 border border-red-500/10" />
                      <p className="text-red-400 font-bold text-center text-sm">- Operador Anônimo {dep.id}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Investment Section */}
              <div className="pt-10">
                <Card className="w-full max-w-2xl mx-auto p-10 bg-black border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center space-y-6">
                  <h2 className="text-2xl font-bold text-white uppercase">INVESTIMENTO HOJE</h2>
                  <div className="space-y-1">
                    <p className="text-red-400 line-through text-xl">De R$97</p>
                    <div className="text-5xl md:text-7xl font-black text-white">
                      R$17
                    </div>
                    <Badge className="bg-green-600 text-white py-1 px-4 mt-2 font-bold animate-pulse">ECONOMIA DE 82%</Badge>
                  </div>

                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/20 italic text-sm text-red-300">
                    "DECLARAÇÃO: Ao ativar, você renuncia à mediocridade, obedece à IA."
                  </div>

                  <div className="space-y-4 pt-4">
                    <button 
                      onClick={() => { playSound("success"); window.location.href = CHECKOUT_URL; }} 
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-xl text-xl md:text-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      ATIVAR A CAIXA PRETA DO FLERTE AGORA
                    </button>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] md:text-xs text-zinc-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Compra segura</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Acesso vitalício</span>
                      <span className="flex items-center gap-1"><Plus className="w-4 h-4" /> Sem mensalidade</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Reject Button */}
              <div className="text-center pt-8">
                <Button 
                  variant="ghost" 
                  onClick={() => { playSound("error"); playCoringaVoceSeLeuAudio(); setCurrentStep(18); }} 
                  className="text-zinc-600 hover:text-red-500 transition-colors uppercase text-xs font-bold tracking-widest"
                >
                  💀 Prefiro continuar vendo dancinha no tiktok
                </Button>
              </div>

            </div>
          </div>
        );

      case 17:
        // Mantido para manter compatibilidade com passos anteriores se necessário
        return (
          <div className="min-h-screen bg-black text-red-300 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden z-10 pt-20">
            <Card className="w-full max-w-4xl p-9 bg-black border-2 border-red-500 rounded-3xl z-10 text-center">
                <Skull className="w-24 h-24 mx-auto mb-8 text-red-500" />
                <h1 className="text-4xl font-bold mb-8 text-red-500">VOCÊ ESCOLHEU SER UM PEGADOR FRACO.</h1>
                <button onClick={() => { playSound("success"); window.location.href = CHECKOUT_URL; }} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-6 px-8 rounded-xl text-xl shadow-[0_0_20px_rgba(239,68,68,0.4)]">QUERO UMA SEGUNDA CHANCE</button>
            </Card>
          </div>
        );

      case 18:
        return (
          <div className="min-h-screen bg-black text-red-300 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden z-10 pt-20">
            <Card className="w-full max-w-4xl p-9 bg-black border-2 border-red-500 rounded-3xl z-10 text-center">
                <Skull className="w-24 h-24 mx-auto mb-8 text-red-500" />
                <h1 className="text-4xl font-bold mb-8 text-red-500 uppercase tracking-tighter">VOCÊ ESCOLHEU SER UM PEGADOR FRACO.</h1>
                <p className="text-xl mb-10 text-red-400">O sistema detectou uma mentalidade de escassez. Você realmente quer continuar sendo invisível?</p>
                <button onClick={() => { playSound("success"); window.location.href = CHECKOUT_URL; }} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-6 px-8 rounded-xl text-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">QUERO UMA SEGUNDA CHANCE</button>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-red-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
         <img src="https://i.imgur.com/L9g8Kx6.png" alt="Mask Logo" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] opacity-90" />
      </div>
      {renderStep()}
      {showXP && <XPNotification show={showXP} points={50} />}
      <BonusModal
        isOpen={showBonusModal}
        onClose={() => setShowBonusModal(false)}
        onAccept={() => {
          setShowBonusModal(false);
          playSound("success");
        }}
      />
    </div>
  );
}