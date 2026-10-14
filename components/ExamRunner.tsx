'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Timer, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lightbulb, 
  RotateCcw, 
  Download, 
  Award, 
  Sparkles, 
  Grid, 
  ChevronRight,
  TrendingUp,
  Share2,
  Clock,
  Printer
} from 'lucide-react';
import { Question, ExamCategory } from '@/data/exams';
import ProfEscudeiroWidget from '@/components/ProfEscudeiroWidget';

interface ExamRunnerProps {
  exam: ExamCategory;
  questions: Question[];
  mode: 'treino' | 'real';
  timeLimitMinutes: number;
  onExit: () => void;
  onSelectAnotherExam: () => void;
}

interface StoredExamResult {
  id: string;
  examId: string;
  examTitle: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  estimatedTri: number;
  timeSpentSeconds: number;
}

export default function ExamRunner({
  exam,
  questions,
  mode,
  timeLimitMinutes,
  onExit,
  onSelectAnotherExam,
}: ExamRunnerProps) {
  // Local storage cache key for this exam session
  const sessionKey = `escsimulados_session_${exam.id}`;

  // Restore initial state from localStorage lazily
  const [sessionInitial] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(`escsimulados_session_${exam.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.examId === exam.id && !parsed.isFinished) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // Current active question index
  const [currentIndex, setCurrentIndex] = useState<number>(() => sessionInitial?.currentIndex || 0);
  
  // Selected answers: { [questionId]: 'A' | 'B' | 'C' | 'D' | 'E' }
  const [answers, setAnswers] = useState<{ [qId: string]: 'A' | 'B' | 'C' | 'D' | 'E' }>(() => sessionInitial?.answers || {});
  
  // Flagged for review: { [qId]: boolean }
  const [flagged, setFlagged] = useState<{ [qId: string]: boolean }>(() => sessionInitial?.flagged || {});
  
  // Whether the exam has been submitted
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  // Time remaining in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => sessionInitial?.secondsRemaining ?? (timeLimitMinutes * 60));
  const [isTimerPaused] = useState<boolean>(false);
  const [timeSpentTotal, setTimeSpentTotal] = useState<number>(0);

  // Filter in the review / gabarito screen: 'all' | 'errors' | 'correct'
  const [reviewFilter, setReviewFilter] = useState<'all' | 'errors' | 'correct'>('all');

  // Confirmation modal to finish
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState<boolean>(false);

  // Question Drawer / Matrix toggle for mobile & desktop
  const [showQuestionMatrix, setShowQuestionMatrix] = useState<boolean>(false);

  // Teacher hint toggle for training mode
  const [showHint, setShowHint] = useState<boolean>(false);

  // Persist session to localStorage on answer or question switch
  useEffect(() => {
    if (isFinished) return;
    try {
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          examId: exam.id,
          answers,
          flagged,
          currentIndex,
          secondsRemaining,
          isFinished: false,
        })
      );
    } catch (err) {
      console.warn('Erro ao salvar progresso local:', err);
    }
  }, [answers, flagged, currentIndex, secondsRemaining, isFinished, exam.id, sessionKey]);

  // Finish exam handler
  const handleFinishExam = React.useCallback(() => {
    setIsFinished(true);
    setShowConfirmFinishModal(false);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / questions.length) * 100);
    // Approximate realistic TRI calculation based on accuracy
    const tri = Math.min(980, Math.max(340, Math.round(350 + (pct / 100) * 550 + (correctCount > 0 ? 30 : 0))));

    // Store in global history
    try {
      localStorage.removeItem(sessionKey);
      const existingHistory: StoredExamResult[] = JSON.parse(
        localStorage.getItem('escsimulados_history') || '[]'
      );
      const newResult: StoredExamResult = {
        id: `result_${Date.now()}`,
        examId: exam.id,
        examTitle: exam.title,
        date: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        score: correctCount,
        total: questions.length,
        percentage: pct,
        estimatedTri: tri,
        timeSpentSeconds: timeSpentTotal,
      };
      existingHistory.unshift(newResult);
      localStorage.setItem('escsimulados_history', JSON.stringify(existingHistory.slice(0, 25)));
    } catch (err) {
      console.warn('Erro ao salvar histórico:', err);
    }

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers, exam.id, exam.title, questions, sessionKey, timeSpentTotal]);

  // Timer countdown
  useEffect(() => {
    if (isFinished || isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentTotal((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, isTimerPaused, handleFinishExam]);

  const currentQ = questions[currentIndex] || questions[0];

  // Helper format seconds
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (isFinished) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowHint(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleRestart = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setIsFinished(false);
    setSecondsRemaining(timeLimitMinutes * 60);
    setTimeSpentTotal(0);
    setShowHint(false);
    try {
      localStorage.removeItem(sessionKey);
    } catch {}
  };

  // Computed results
  const correctQuestions = questions.filter((q) => answers[q.id] === q.correctOption);
  const correctCount = correctQuestions.length;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const estimatedTri = Math.min(980, Math.max(340, Math.round(350 + (percentage / 100) * 550 + (correctCount > 0 ? 30 : 0))));

  const filteredQuestions = questions.filter((q) => {
    const isCorrect = answers[q.id] === q.correctOption;
    if (reviewFilter === 'errors') return !isCorrect;
    if (reviewFilter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] flex flex-col relative">
      
      {/* Classroom Ambient Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.14]">
        <Image
          src="/classroom_bg.jpg"
          alt="Sala de aula ambiente"
          fill
          className="object-cover object-center filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/90" />
      </div>

      {/* Sticky Exam Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Left: Back / Exit & Exam Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isFinished && answeredCount > 0) {
                  if (confirm('Deseja sair do simulado? Seu progresso atual continuará salvo neste navegador.')) {
                    onExit();
                  }
                } else {
                  onExit();
                }
              }}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs sm:text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-[#FFDBCC] text-[#7A3000]">
                {exam.tag}
              </span>
              <span className="font-heading font-bold text-xs sm:text-base text-[#151C27] truncate max-w-[140px] sm:max-w-xs md:max-w-md">
                {currentQ?.subject || exam.title}
              </span>
            </div>
          </div>

          {/* Right: Timer & Question Matrix Button & Submit */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Timer Badge (Orange Highlight) */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
                secondsRemaining < 120 && !isFinished
                  ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                  : 'bg-[#FFF7ED] text-[#FF6B00] border-orange-200 shadow-2xs'
              }`}
            >
              <Timer className="w-4 h-4 text-[#FF6B00]" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Question matrix toggle */}
            <button
              onClick={() => setShowQuestionMatrix(!showQuestionMatrix)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              title="Mapa de Questões"
            >
              <Grid className="w-4 h-4 text-gray-500" />
              <span className="hidden md:inline">Mapa</span>
              <span className="text-xs font-bold text-[#FF6B00]">
                {answeredCount}/{questions.length}
              </span>
            </button>

            {/* Finish Button */}
            {!isFinished && (
              <button
                onClick={() => setShowConfirmFinishModal(true)}
                className="bg-[#FF6B00] hover:bg-[#E05D00] text-white text-xs sm:text-sm font-heading font-bold px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Finalizar Prova
              </button>
            )}
          </div>
        </div>

        {/* Linear Progress Bar under header */}
        {!isFinished && (
          <div className="w-full h-1 bg-gray-100">
            <div
              className="h-full bg-[#FF6B00] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

        {/* ----------------- GABARITO & DIAGNOSTIC REPORT (WHEN FINISHED) ----------------- */}
        {isFinished ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Celebration & TRI Score Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B00]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col text-center md:text-left gap-2">
                  <div className="inline-flex items-center gap-1.5 self-center md:self-start px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulado Concluído com Sucesso</span>
                  </div>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#151C27]">
                    Resultado & Gabarito Comentado
                  </h1>
                  <p className="text-gray-600 text-sm max-w-lg">
                    {exam.title} • {currentQ?.grade || 'Ensino Fundamental & Médio'} • Acesso sem login liberado
                  </p>
                </div>

                {/* Big Score Box */}
                <div className="flex items-center gap-6 bg-[#F0F3FF] p-5 sm:p-6 rounded-2xl border border-blue-50">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
                      Nota Estimada (TRI)
                    </span>
                    <span className="font-heading text-4xl sm:text-5xl font-black text-[#FF6B00] leading-none pt-1">
                      {estimatedTri}
                    </span>
                    <span className="text-[11px] text-gray-500 pt-1 font-medium">
                      Escala Oficial Brasil
                    </span>
                  </div>

                  <div className="w-px h-16 bg-gray-300" />

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">
                      Acertos: <strong className="text-[#151C27]">{correctCount} de {questions.length}</strong>
                    </span>
                    <span className="text-xl font-heading font-extrabold text-emerald-600">
                      {percentage}%
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {Math.floor(timeSpentTotal / 60)}m {timeSpentTotal % 60}s gastos
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-[#FF6B00]" />
                    <span>Refazer Este Simulado</span>
                  </button>

                  <button
                    onClick={onSelectAnotherExam}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#151C27] hover:bg-gray-800 text-white text-sm font-semibold transition-colors"
                  >
                    <span>Escolher Outra Prova</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    <Printer className="w-4 h-4 text-gray-500" />
                    <span>Imprimir Gabarito</span>
                  </button>
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Salvo no histórico do navegador automaticamente
                </div>
              </div>

            </div>

            {/* Filter Tabs for Questions Review */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase text-gray-500">Filtrar questões:</span>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      reviewFilter === 'all'
                        ? 'bg-[#FF6B00] text-white shadow-2xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Todas ({questions.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('correct')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      reviewFilter === 'correct'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Acertos ({correctCount})
                  </button>
                  <button
                    onClick={() => setReviewFilter('errors')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      reviewFilter === 'errors'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Erros ({questions.length - correctCount})
                  </button>
                </div>
              </div>

              <span className="text-xs text-gray-500">
                Gabarito comentado detalhado com base na BNCC e Matriz de Habilidades
              </span>
            </div>

            {/* Detailed Question Review List */}
            <div className="space-y-6">
              {filteredQuestions.map((q, idx) => {
                const studentAns = answers[q.id];
                const isCorrect = studentAns === q.correctOption;
                const originalIndex = questions.findIndex((item) => item.id === q.id) + 1;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-3xl p-6 sm:p-8 border-2 shadow-sm flex flex-col gap-5 ${
                      isCorrect ? 'border-emerald-200' : 'border-red-200'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-base text-[#151C27]">
                          Questão {originalIndex < 10 ? `0${originalIndex}` : originalIndex}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {q.subject}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {q.skillCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Acertou
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            {studentAns ? `Errou (marcou ${studentAns})` : 'Não respondeu'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Context Source if present */}
                    {q.contextSource && (
                      <span className="text-xs italic text-gray-500">
                        Fonte: {q.contextSource}
                      </span>
                    )}

                    {/* Statement */}
                    <p className="text-base text-[#151C27] font-medium leading-relaxed whitespace-pre-line">
                      {q.statement}
                    </p>

                    {/* Alternatives breakdown */}
                    <div className="space-y-2.5">
                      {q.options.map((opt) => {
                        const isStudentChoice = studentAns === opt.id;
                        const isCorrectOption = q.correctOption === opt.id;

                        let rowStyle = 'bg-gray-50 border-gray-200 text-gray-700 opacity-70';
                        let badgeStyle = 'bg-gray-200 text-gray-700';

                        if (isCorrectOption) {
                          rowStyle = 'bg-emerald-50 border-emerald-500 font-semibold text-emerald-950 opacity-100 ring-2 ring-emerald-500/20';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else if (isStudentChoice && !isCorrectOption) {
                          rowStyle = 'bg-red-50 border-red-400 font-semibold text-red-950 opacity-100 ring-2 ring-red-500/20';
                          badgeStyle = 'bg-red-600 text-white';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${rowStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-lg font-heading font-bold text-sm flex items-center justify-center flex-shrink-0 ${badgeStyle}`}>
                                {opt.id}
                              </span>
                              <span className="text-sm">{opt.text}</span>
                            </div>

                            {isCorrectOption && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                                Gabarito Correto
                              </span>
                            )}
                            {isStudentChoice && !isCorrectOption && (
                              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                                Sua Resposta
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-Step Pedagogical Explanation */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2">
                      <div className="flex items-center gap-2 font-heading font-bold text-sm text-amber-900">
                        <Lightbulb className="w-4 h-4 text-[#FF6B00]" />
                        <span>Resolução Passo a Passo & Habilidade Avaliada:</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-gray-800">
                        {q.explanation}
                      </p>
                      {q.skillDescription && (
                        <p className="text-xs text-amber-900/80 pt-1 font-medium border-t border-amber-200/60">
                          <strong>Matriz Pedagógica:</strong> {q.skillDescription}
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* ----------------- ACTIVE TEST QUESTION TAKING INTERFACE ----------------- */
          <div className="space-y-6">
            
            {/* Question Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100 flex flex-col gap-6 relative">
              
              {/* Question Header Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-extrabold text-base sm:text-lg text-[#FF6B00]">
                    Questão {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} de {questions.length}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {currentQ.grade}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800">
                    {currentQ.skillCode}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    currentQ.difficulty === 'Fácil'
                      ? 'bg-emerald-100 text-emerald-800'
                      : currentQ.difficulty === 'Média'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    Dificuldade: {currentQ.difficulty}
                  </span>
                </div>

                {/* Mark for review toggle */}
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    flagged[currentQ.id]
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{flagged[currentQ.id] ? 'Marcada para Revisão' : 'Marcar para Revisão'}</span>
                </button>
              </div>

              {/* Context text or source */}
              {currentQ.contextSource && (
                <div className="text-xs italic text-gray-500 font-medium">
                  {currentQ.contextSource}
                </div>
              )}

              {/* Statement */}
              <div className="text-base sm:text-lg text-[#151C27] font-medium leading-relaxed whitespace-pre-line">
                {currentQ.statement}
              </div>

              {/* Alternatives List */}
              <fieldset className="flex flex-col gap-3">
                <legend className="sr-only">Selecione uma alternativa de resposta</legend>
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF6B00] bg-[#FFF7ED] ring-2 ring-orange-500/20 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-[#FFFBF7]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-10 h-10 rounded-xl font-heading text-base font-bold flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#FF6B00] text-white shadow-2xs'
                              : 'bg-gray-100 text-[#151C27]'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-sm sm:text-base font-medium text-[#151C27]">
                          {opt.text}
                        </span>
                      </div>

                      <input
                        type="radio"
                        name={`question_${currentQ.id}`}
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => handleSelectOption(opt.id)}
                        className="w-5 h-5 accent-[#FF6B00]"
                      />
                    </label>
                  );
                })}
              </fieldset>

              {/* Teacher Hint Accordion (Available in Training Mode or practice) */}
              {(mode === 'treino' || showHint) && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-1 text-xs sm:text-sm animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-amber-900">
                    <Lightbulb className="w-4 h-4 text-[#FF6B00]" />
                    <span>Dica do Professor:</span>
                  </div>
                  <p className="leading-relaxed text-gray-800">
                    {currentQ.teacherHint}
                  </p>
                </div>
              )}

              {/* Navigation Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold transition-all ${
                      currentIndex === 0
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#151C27] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>{showHint ? 'Ocultar Dica' : 'Ver Dica'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#151C27] hover:bg-gray-800 text-white text-xs sm:text-sm font-heading font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <span>Próxima Questão</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirmFinishModal(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E05D00] text-white text-xs sm:text-sm font-heading font-bold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finalizar Simulado</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Question Selector Matrix Grid */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>Navegação Rápida entre Questões:</span>
                <span className="text-[#FF6B00] font-mono">
                  {answeredCount} de {questions.length} respondidas
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answers[q.id];
                  const isFlagged = !!flagged[q.id];

                  let style = 'bg-[#F9F9FB] border-gray-200 text-gray-600 hover:bg-gray-100';
                  if (isAnswered) {
                    style = 'bg-[#151C27] text-white border-[#151C27]';
                  }
                  if (isFlagged) {
                    style = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';
                  }
                  if (isCurrent) {
                    style += ' ring-2 ring-[#FF6B00] ring-offset-2 border-[#FF6B00] font-black';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowHint(false);
                      }}
                      className={`w-9 h-9 rounded-xl border text-xs font-mono font-bold flex items-center justify-center transition-all ${style}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#151C27]" /> Respondida
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-400" /> Marcada para Revisão
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300" /> Não respondida
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full ring-2 ring-[#FF6B00]" /> Atual
                </span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Confirmation Modal to Finish */}
      {showConfirmFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#151C27]">
                Finalizar Simulado?
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Você respondeu <strong className="text-black">{answeredCount} de {questions.length}</strong> questões.
              {unansweredCount > 0 && (
                <span className="block mt-1 text-amber-700 font-semibold">
                  Atenção: Existem {unansweredCount} questão(ões) em branco!
                </span>
              )}
            </p>

            <p className="text-xs text-gray-500">
              Ao confirmar, seu gabarito comentado, pontuação percentual e nota calculada serão exibidos imediatamente na tela, sem exigir cadastro.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowConfirmFinishModal(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Voltar à Prova
              </button>

              <button
                type="button"
                onClick={handleFinishExam}
                className="bg-[#FF6B00] hover:bg-[#E05D00] text-white text-xs sm:text-sm font-heading font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                Sim, Ver Meu Gabarito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online Teacher Pop-up Assistant: Prof. Escudeiro */}
      <ProfEscudeiroWidget currentQuestion={currentQ} examTitle={exam.title} />

    </div>
  );
}
