'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Sparkles, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { EXAM_CATEGORIES, ExamCategory } from '@/data/exams';

interface ExamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedExamId?: string;
  onStartExam: (config: {
    examId: string;
    grade: string;
    subject: string;
    mode: 'treino' | 'real';
    timeLimitMinutes: number;
  }) => void;
}

export default function ExamSelectionModal({
  isOpen,
  onClose,
  preSelectedExamId,
  onStartExam,
}: ExamSelectionModalProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>(preSelectedExamId || 'enem');
  const [selectedGrade, setSelectedGrade] = useState<string>('Todas');
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [examMode, setExamMode] = useState<'treino' | 'real'>('real');
  const [timeOption, setTimeOption] = useState<number>(3); // minutes per question default

  // Sync state if preSelectedExamId prop changes
  const [prevExamProp, setPrevExamProp] = useState(preSelectedExamId);
  if (preSelectedExamId !== prevExamProp) {
    setPrevExamProp(preSelectedExamId);
    if (preSelectedExamId) {
      setSelectedExamId(preSelectedExamId);
      const ex = EXAM_CATEGORIES.find((c) => c.id === preSelectedExamId);
      if (ex) {
        setSelectedGrade(ex.grades[0] || 'Todas');
        setSelectedSubject('Todas');
      }
    }
  }

  if (!isOpen) return null;

  const currentExam = EXAM_CATEGORIES.find((c) => c.id === selectedExamId) || EXAM_CATEGORIES[0];

  const handleLaunch = () => {
    const totalQCount = currentExam.questions.length;
    const timeLimitMinutes = examMode === 'real' ? totalQCount * timeOption : totalQCount * 4;
    onStartExam({
      examId: selectedExamId,
      grade: selectedGrade,
      subject: selectedSubject,
      mode: examMode,
      timeLimitMinutes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 via-white to-orange-50/50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-[#151C27]">
                Configurar Simulado Instantâneo
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                100% Grátis • Sem necessidade de cadastro ou login
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Escolha o Exame */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between">
              <span>1. Escolha a Prova ou Exame Oficial:</span>
              <span className="text-[11px] font-semibold text-[#FF6B00]">
                {currentExam.simuladosCount} questões disponíveis
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EXAM_CATEGORIES.map((exam) => {
                const isSelected = exam.id === selectedExamId;
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setSelectedGrade(exam.grades[0] || 'Todas');
                      setSelectedSubject('Todas');
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-[#FF6B00] bg-[#FFF7ED] ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-heading font-extrabold ${isSelected ? 'text-[#FF6B00]' : 'text-[#151C27]'}`}>
                        {exam.tag}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />}
                    </div>
                    <span className="text-[11px] text-gray-500 line-clamp-1">
                      {exam.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Seleção de Ano/Série e Disciplina */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Ano / Série */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                <span>Ano Escolar / Nível:</span>
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#151C27] bg-white focus:outline-hidden focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="Todas">Todos os Níveis disponíveis</option>
                {currentExam.grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Disciplina */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                <span>Área / Disciplina:</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#151C27] bg-white focus:outline-hidden focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="Todas">Todas as Disciplinas</option>
                {currentExam.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* 3. Modo de Aplicação */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <span>Modo de Prova:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Modo Simulado Real */}
              <div
                onClick={() => setExamMode('real')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  examMode === 'real'
                    ? 'border-[#FF6B00] bg-[#FFF7ED] ring-2 ring-orange-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#151C27]">
                    <Clock className="w-4 h-4 text-[#FF6B00]" />
                    <span>Modo Exame Real</span>
                  </div>
                  <input
                    type="radio"
                    checked={examMode === 'real'}
                    onChange={() => setExamMode('real')}
                    className="accent-[#FF6B00]"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Cronômetro regressivo de 3 min/questão, gabarito bloqueado até o término e cálculo TRI.
                </p>
              </div>

              {/* Modo Prática Livre */}
              <div
                onClick={() => setExamMode('treino')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  examMode === 'treino'
                    ? 'border-[#FF6B00] bg-[#FFF7ED] ring-2 ring-orange-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#151C27]">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                    <span>Modo Estudo Guiado</span>
                  </div>
                  <input
                    type="radio"
                    checked={examMode === 'treino'}
                    onChange={() => setExamMode('treino')}
                    className="accent-[#FF6B00]"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Sem pressão de tempo, acesso à Dica do Professor durante a resolução e revisão pedagógica imediata.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Ao clicar no botão abaixo, a prova será carregada na tela <strong>imediatamente</strong>. Seu progresso é salvo no navegador automaticamente.
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 text-center sm:text-left">
            <span>Prova: <strong>{currentExam.tag}</strong> • {currentExam.questions.length} questões selecionadas</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleLaunch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E05D00] text-white text-sm font-heading font-bold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Iniciar Simulado Agora</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
