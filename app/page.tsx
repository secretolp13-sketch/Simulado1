'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Clock, 
  BookOpen, 
  BarChart3, 
  Layers, 
  Award, 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  FileText,
  LockOpen
} from 'lucide-react';
import Header from '@/components/Header';
import StudentHeroCard from '@/components/StudentHeroCard';
import InteractiveDemoWidget from '@/components/InteractiveDemoWidget';
import ExamSelectionModal from '@/components/ExamSelectionModal';
import ExamRunner from '@/components/ExamRunner';
import HistoryModal from '@/components/HistoryModal';
import Footer from '@/components/Footer';
import ProfEscudeiroWidget from '@/components/ProfEscudeiroWidget';
import { EXAM_CATEGORIES, ExamCategory, getExamById, getQuestionsForExam } from '@/data/exams';

export default function HomePage() {
  // Modal states
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('enem');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Active Exam state (when taking a test)
  const [activeExamConfig, setActiveExamConfig] = useState<{
    exam: ExamCategory;
    mode: 'treino' | 'real';
    timeLimitMinutes: number;
    grade: string;
    subject: string;
  } | null>(null);

  // Category filter on the Vitrine de Provas
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todos');

  // Handle opening modal for an exam
  const handleOpenExamModal = (examId: string) => {
    setSelectedExamId(examId);
    setIsSelectionModalOpen(true);
  };

  // Launch test directly
  const handleStartExam = (config: {
    examId: string;
    grade: string;
    subject: string;
    mode: 'treino' | 'real';
    timeLimitMinutes: number;
  }) => {
    const exam = getExamById(config.examId) || EXAM_CATEGORIES[0];
    setActiveExamConfig({
      exam,
      mode: config.mode,
      timeLimitMinutes: config.timeLimitMinutes,
      grade: config.grade,
      subject: config.subject,
    });
    setIsSelectionModalOpen(false);
  };

  // Navigate to section
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'fundamental') {
      setActiveCategoryFilter('Fundamental');
      const el = document.getElementById('provas-cobertas');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'medio') {
      setActiveCategoryFilter('Medio');
      const el = document.getElementById('provas-cobertas');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'olimpiadas') {
      setActiveCategoryFilter('Olimpiada');
      const el = document.getElementById('provas-cobertas');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If an exam is currently running, show the dedicated ExamRunner full-screen interface
  if (activeExamConfig) {
    const questions = getQuestionsForExam(activeExamConfig.exam.id);

    return (
      <ExamRunner
        exam={activeExamConfig.exam}
        questions={questions}
        mode={activeExamConfig.mode}
        timeLimitMinutes={activeExamConfig.timeLimitMinutes}
        onExit={() => setActiveExamConfig(null)}
        onSelectAnotherExam={() => {
          setActiveExamConfig(null);
          setIsSelectionModalOpen(true);
        }}
      />
    );
  }

  // Filtered exams list
  const filteredExams = EXAM_CATEGORIES.filter((exam) => {
    if (activeCategoryFilter === 'todos') return true;
    return exam.targetAudience === activeCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] flex flex-col font-sans">
      
      {/* 1. Header */}
      <Header
        onStartQuickExam={() => handleOpenExamModal('enem')}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      <main className="w-full flex-1">
        
        {/* 2. HERO SECTION WITH CLASSROOM BACKGROUND */}
        <section className="relative w-full overflow-hidden bg-white pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-gray-100">
          
          {/* Classroom Photographic Ambient Background Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Image
              src="/classroom_bg.jpg"
              alt="Ambiente ilustrativo de sala de aula moderna e iluminada"
              fill
              priority
              className="object-cover object-center opacity-30 sm:opacity-35 filter blur-[0.6px] scale-105"
            />
            {/* Multi-layer gradients ensuring crisp contrast, legible typography, and aesthetic warmth */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white" />
          </div>

          {/* Subtle Ambient Glowing Orbs */}
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#FF6B00]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#D9DFF5]/40 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Live Status Tag */}
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#F0F3FF] border border-blue-100 shadow-2xs">
                  <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-800">
                    Edição 2025/2026 Atualizada
                  </span>
                  <span className="text-[11px] font-heading font-extrabold text-[#A04100] px-2 py-0.5 rounded-full bg-[#FFDBCC]">
                    Novo
                  </span>
                </div>

                {/* Main Hero Heading */}
                <div className="flex flex-col gap-3">
                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#151C27] tracking-tight leading-[1.18]">
                    A melhor preparação para suas provas do{' '}
                    <span className="text-[#FF6B00] underline decoration-[#FF6B00]/30 decoration-wavy decoration-2">
                      Ensino Fundamental
                    </span>{' '}
                    e{' '}
                    <span className="text-[#151C27] underline decoration-[#FF6B00]/40 decoration-2">
                      Médio
                    </span>
                    .
                  </h1>

                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Simulados online baseados na <strong>BNCC</strong>, <strong>ENEM</strong> e principais exames do Brasil, com relatórios detalhados de desempenho e calibragem TRI para você dominar cada questão.
                  </p>
                </div>

                {/* Free Access Guarantee Strip */}
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl self-start">
                  <LockOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Livre e Gratuito: Sem tela de login, formulários ou cartão de crédito.</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                  <button
                    onClick={() => handleOpenExamModal('enem')}
                    className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-heading font-bold text-base px-6 py-3.5 rounded-xl shadow-[0_12px_24px_-8px_rgba(255,107,0,0.45)] hover:bg-[#E05D00] hover:shadow-[0_16px_28px_-6px_rgba(255,107,0,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Começar Simulados Gratuitos</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <a
                    href="#provas-cobertas"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-heading font-semibold text-base px-6 py-3.5 rounded-xl border border-gray-200 shadow-2xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-[#FF6B00] fill-current" />
                    <span>Ver Provas e Exames</span>
                  </a>
                </div>

                {/* Trust Proof Metrics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 bg-[#F0F3FF]/70 p-4 rounded-2xl border border-blue-50/80 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-lg font-extrabold text-[#151C27] leading-tight">
                        +150.000
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Questões Resolvidas
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-lg font-extrabold text-[#151C27] leading-tight">
                        100% BNCC
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        & Matriz ENEM Oficial
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-lg font-extrabold text-[#151C27] leading-tight">
                        4.9 / 5.0
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Por +48.000 Alunos
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Mockup / Visual Card */}
              <div className="lg:col-span-5 relative">
                <StudentHeroCard />
              </div>

            </div>
          </div>
        </section>

        {/* 3. KEY FEATURES GRID (4 Cards - Rigor Pedagógico) */}
        <section className="w-full bg-[#E7EEFE]/50 py-16 sm:py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#FF6B00]">
                  Pilares da Plataforma
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#151C27] tracking-tight">
                  Desenvolvido com Rigor Pedagógico
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 max-w-md">
                Metodologia desenhada para criar rotina de estudo assertiva e eliminar a ansiedade no dia da prova.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1 */}
              <div 
                onClick={() => handleNavigateSection('fundamental')}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-gray-100 hover:border-orange-200"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      Segmentado
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#151C27] pt-1">
                    Ensino Fundamental & Médio
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Conteúdo criteriosamente dividido por anos escolares: do 6º ao 9º ano e do 1º ao 3º ano do Ensino Médio sem misturar níveis.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-xs font-heading font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                  <span>Explorar matriz</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2 */}
              <div 
                onClick={() => handleOpenExamModal('enem')}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-gray-100 hover:border-orange-200"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFDBCC] text-[#7A3000]">
                      Diagnóstico Imediato
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#151C27] pt-1">
                    Relatórios Detalhados
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Feedback instantâneo mostrando pontos fortes, temas críticos para revisão, coerência pedagógica e comparativo TRI.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-xs font-heading font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                  <span>Ver modelo de relatório</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 3 */}
              <div 
                onClick={() => {
                  const el = document.getElementById('provas-cobertas');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-gray-100 hover:border-orange-200"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      +50.000 Itens
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#151C27] pt-1">
                    Banco de Questões Atualizado
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Milhares de itens comentados com resolução passo a passo, alinhados com rigor às diretrizes e matrizes de habilidades do MEC.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-xs font-heading font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                  <span>Filtrar questões</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 4 */}
              <div 
                onClick={() => handleOpenExamModal('enem')}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-gray-100 hover:border-orange-200"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 text-[#151C27] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Clock className="w-6 h-6 text-[#FF6B00]" />
                    </div>
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      Pressão Real
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#151C27] pt-1">
                    Modo Cronometrado
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Simule as condições exatas do dia da prova com contagem regressiva, alerta de tempo por questão e gabarito bloqueado até a entrega.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-xs font-heading font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                  <span>Iniciar no cronômetro</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. EXAMS & CONTENT CATEGORIES (Vitrine de Provas e Exames) */}
        <section className="w-full bg-white py-16 sm:py-20" id="provas-cobertas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2.5 max-w-2xl mx-auto">
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#FF6B00]">
                Matriz Completa de Avaliações
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#151C27] tracking-tight">
                Exames Oficiais e Provas Cobertas
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Treine exatamente para a prova que você vai prestar, com cadernos anteriores e inéditos elaborados por bancas examinadoras.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {[
                { id: 'todos', label: 'Todas as Provas' },
                { id: 'Fundamental', label: 'Ensino Fundamental (6º ao 9º)' },
                { id: 'Medio', label: 'Ensino Médio (ENEM & Provão)' },
                { id: 'Olimpiada', label: 'Olimpíadas (OBMEP & OBA)' },
                { id: 'Tecnico', label: 'Vestibulinhos (ETEC & IFs)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === tab.id
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                      : 'bg-[#F0F3FF] text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid of Exam Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredExams.map((exam) => {
                return (
                  <div
                    key={exam.id}
                    className="bg-[#F0F3FF]/70 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group border border-blue-50/80 hover:border-orange-300"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-[#FF6B00] text-white font-heading text-sm font-extrabold shadow-xs">
                          {exam.tag}
                        </span>
                        <span className="text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded-full shadow-2xs border border-gray-100">
                          {exam.badge}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-[#151C27] pt-1">
                        {exam.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {exam.description}
                      </p>

                      {/* Grades tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exam.grades.slice(0, 3).map((g) => (
                          <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-gray-600 border border-gray-200">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-between border-t border-gray-200/60 mt-4">
                      <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                        <span className={`w-2.5 h-2.5 rounded-full ${exam.levelColor}`} />
                        <span>{exam.levelBadge}</span>
                      </span>

                      <button
                        onClick={() => handleOpenExamModal(exam.id)}
                        className="text-xs sm:text-sm font-heading font-bold text-[#FF6B00] group-hover:text-[#E05D00] flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer"
                      >
                        <span>Acessar simulados</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 5. INTERACTIVE DEMO WIDGET (Simulação ao vivo BNCC 9º ano) */}
        <InteractiveDemoWidget />

        {/* 6. COMMUNITY & RESULTS SHOWCASE */}
        <section className="w-full bg-white py-16 sm:py-20 border-b border-gray-100" id="comunidade">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Photo Showcase Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-900 border border-gray-100">
                  <Image
                    src="https://picsum.photos/seed/students-brazil/800/600"
                    alt="Estudantes brasileiros estudando com foco em ambiente moderno"
                    fill
                    className="object-cover opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-[#FFDBCC] mb-1">
                      Evidências e Aprendizagem
                    </span>
                    <p className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                      &quot;A resolução frequente de simulados diagnósticos por descritores eleva em até 32% o alcance de proficiência adequada nas matrizes do SAEB e IDEB.&quot;
                    </p>
                    <span className="text-xs text-gray-300 pt-1 font-medium">
                      Parâmetro de Referência • Ensino Fundamental e Médio
                    </span>
                  </div>
                </div>
              </div>

              {/* Bullet Highlights */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#FF6B00]">
                    Resultados Comprovados
                  </span>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#151C27] tracking-tight leading-tight">
                    Mais que fazer questões: você aprende a gerenciar seu tempo de prova.
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F0F3FF] border border-blue-50">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#151C27]">
                        Simulação fiel da Teoria de Resposta ao Item (TRI)
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 pt-0.5">
                        Identifique questões fáceis, médias e difíceis para evitar coerência pedagógica truncada e maximizar a pontuação final.
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F0F3FF] border border-blue-50">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#151C27]">
                        Controle exato de 3 minutos por questão
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 pt-0.5">
                        Nosso velocímetro de resolução indica em quais disciplinas você está perdendo tempo excessivo e onde deve acelerar.
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F0F3FF] border border-blue-50">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#151C27]">
                        Apoio para escolas públicas e particulares
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 pt-0.5">
                        Acesso democrático e gratuito com planos de aprofundamento voltados a alunos de alto rendimento do Ensino Fundamental e Médio.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 7. BANNER / CTA STRIP */}
        <section className="w-full bg-white py-14 sm:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#A04100] via-[#FF6B00] to-[#E05D00] p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Classroom Textured Backdrop Overlay */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                <Image
                  src="/classroom_bg.jpg"
                  alt="Textura de sala de aula no banner"
                  fill
                  className="object-cover opacity-20 mix-blend-overlay filter contrast-125"
                />
              </div>

              {/* Background light circle decoration */}
              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col gap-2 max-w-xl z-10 text-center md:text-left">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#FFDBCC]">
                  Início Imediato • 100% Livre e Gratuito
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                  Pronto para alcançar a sua melhor nota?
                </h2>
                <p className="text-sm sm:text-base text-white/90">
                  Comece a treinar agora mesmo sem login, preenchimento de formulários ou qualquer bloqueio. Escolha sua prova e teste seus conhecimentos!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
                <button
                  onClick={() => handleOpenExamModal('enem')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#151C27] font-heading font-bold text-base px-8 py-4 rounded-xl shadow-xl hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Iniciar Simulado Grátis</span>
                  <ArrowRight className="w-5 h-5 text-[#FF6B00]" />
                </button>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 8. Footer */}
      <Footer onSelectExam={(id) => handleOpenExamModal(id)} />

      {/* Exam Configuration / Quick Launcher Modal */}
      <ExamSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        preSelectedExamId={selectedExamId}
        onStartExam={handleStartExam}
      />

      {/* History Modal */}
      {isHistoryOpen && (
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onLaunchExamId={(id) => handleOpenExamModal(id)}
        />
      )}

      {/* Online Teacher Pop-up Assistant: Prof. Escudeiro */}
      <ProfEscudeiroWidget />

    </div>
  );
}

