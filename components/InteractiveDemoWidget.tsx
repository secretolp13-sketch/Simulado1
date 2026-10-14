'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Lightbulb, CheckCircle2, AlertCircle, RotateCcw, Send, Sparkles } from 'lucide-react';

export default function InteractiveDemoWidget() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(165); // 02:45
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelect = (letter: string) => {
    if (hasSubmitted) return;
    setSelectedOption(letter);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);
    setIsTimerActive(false);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setShowHint(false);
    setTimeLeft(165);
    setIsTimerActive(true);
  };

  const isCorrect = selectedOption === 'B';

  const options = [
    { id: 'A', text: '20 alunos' },
    { id: 'B', text: '24 alunos' },
    { id: 'C', text: '26 alunos' },
    { id: 'D', text: '28 alunos' },
  ];

  return (
    <section className="w-full bg-[#E2E8F8]/60 py-16" id="simulador-demo">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B00] bg-orange-100/60 px-3 py-1 rounded-full">
            Simulação Ao Vivo
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#151C27] tracking-tight">
            Experimente Agora: Como funciona na prática
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl">
            Resolva esta questão real retirada do banco BNCC do 9º ano e sinta a experiência de resposta rápida e diagnóstico transparente.
          </p>
        </div>

        {/* Question Card Box */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 relative border border-gray-100">
          
          {/* Card Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 bg-[#F0F3FF] p-4 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-[#FFDBCC] text-[#7A3000]">
                Matemática • 9º Ano
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-gray-700 shadow-xs border border-gray-200">
                BNCC: EF09MA06
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                Dificuldade: Média
              </span>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 font-heading text-sm font-mono font-bold bg-white px-3 py-1.5 rounded-xl shadow-xs border border-gray-200 text-[#151C27]">
              <Timer className="w-4 h-4 text-[#FF6B00] animate-pulse" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-[#FF6B00] text-lg sm:text-xl">
                Questão 01
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-500">
                • SAEB & Provas de Seleção
              </span>
            </div>
            <p className="text-base sm:text-lg text-[#151C27] font-medium leading-relaxed">
              Em uma turma de 9º ano com <strong className="text-black">32 alunos</strong> matriculados, exatamente <strong className="text-[#FF6B00]">75%</strong> dos estudantes participaram do simulado diagnóstico de Matemática no primeiro semestre letivo. Quantos alunos realizaram a avaliação?
            </p>
          </div>

          {/* Options List */}
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">Selecione uma alternativa de resposta</legend>
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              let containerStyle = 'bg-white border-gray-200 hover:border-orange-300 hover:bg-[#FFFBF7]';
              let badgeStyle = 'bg-gray-100 text-[#151C27]';

              if (hasSubmitted) {
                if (opt.id === 'B') {
                  containerStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isSelected && opt.id !== 'B') {
                  containerStyle = 'bg-red-50 border-red-500 ring-2 ring-red-500/20';
                  badgeStyle = 'bg-red-600 text-white';
                } else {
                  containerStyle = 'bg-gray-50 opacity-60 border-gray-200';
                }
              } else if (isSelected) {
                containerStyle = 'bg-[#FFF7ED] border-[#FF6B00] ring-2 ring-orange-500/20 shadow-sm';
                badgeStyle = 'bg-[#FF6B00] text-white';
              }

              return (
                <label
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${containerStyle}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-10 h-10 rounded-xl font-heading text-base font-bold flex items-center justify-center transition-colors ${badgeStyle}`}>
                      {opt.id}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-[#151C27]">
                      {opt.text}
                    </span>
                  </div>

                  <input
                    type="radio"
                    name="demo-quiz"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => handleSelect(opt.id)}
                    disabled={hasSubmitted}
                    className="w-5 h-5 accent-[#FF6B00]"
                  />
                </label>
              );
            })}
          </fieldset>

          {/* Solution Box (Visible after submission) */}
          {hasSubmitted && (
            <div
              className={`p-5 rounded-2xl shadow-sm flex flex-col gap-2.5 transition-all animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                  : 'bg-amber-50 text-amber-950 border border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                )}
                <span className="font-heading font-bold text-sm sm:text-base">
                  {isCorrect
                    ? 'Parabéns! Resposta Correta (Alternativa B: 24 alunos).'
                    : 'Atenção: A alternativa correta é a B (24 alunos). Veja a explicação abaixo:'}
                </span>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed space-y-1.5 pt-1 pl-7">
                <p>
                  <strong>Resolução Passo a Passo:</strong>
                </p>
                <p>1. Representando a porcentagem como fração irredutível: 75% = 75/100 = <strong>3/4</strong>.</p>
                <p>2. Multiplicando pelo total de matriculados: (3/4) × 32 = (3 × 32) / 4 = 96 / 4 = <strong>24 alunos</strong>.</p>
                <p className="text-xs text-gray-600 pt-1">
                  <em>Competência BNCC EF09MA06:</em> Compreensão de proporcionalidade e cálculo mental de porcentagens.
                </p>
              </div>
            </div>
          )}

          {/* Teacher Hint Box (Toggleable) */}
          {showHint && !hasSubmitted && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-col gap-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-heading font-bold text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Dica do Professor:</span>
              </div>
              <p className="leading-relaxed">
                Lembre-se que calcular 75% equivale a encontrar a metade (50%) mais a metade dessa metade (25%). 
                Metade de 32 = 16. Metade de 16 = 8. Somando 16 + 8 temos <strong>24 alunos</strong>!
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#151C27] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-[#FF6B00]" />
              <span>{showHint ? 'Ocultar Dica' : 'Dica do Professor'}</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-gray-600 hover:text-[#151C27] text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpar</span>
              </button>

              {!hasSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-heading font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all ${
                    selectedOption
                      ? 'bg-[#FF6B00] text-white hover:bg-[#E05D00] shadow-orange-500/20 cursor-pointer transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Responder Questão</span>
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#151C27] hover:bg-gray-800 text-white font-heading font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Tentar Novamente</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
