'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Award, 
  History, 
  Zap, 
  Menu, 
  X,
  CheckCircle2,
  LockOpen
} from 'lucide-react';

interface HeaderProps {
  onStartQuickExam: () => void;
  onOpenHistory: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export default function Header({
  onStartQuickExam,
  onOpenHistory,
  onNavigateSection,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:bg-[#E05D00] transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#151C27] flex items-center gap-1">
              ESC<span className="text-[#FF6B00]">SIMULADOS</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 -mt-1 hidden sm:inline">
              100% Grátis & Sem Cadastro
            </span>
          </div>
        </div>

        {/* Desktop Quick Nav Menu */}
        <nav className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => onNavigateSection('inicio')}
            className="text-sm font-semibold text-gray-600 hover:text-[#151C27] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FF6B00] hover:after:w-full after:transition-all"
          >
            Início
          </button>
          <button 
            onClick={() => onNavigateSection('fundamental')}
            className="text-sm font-semibold text-gray-600 hover:text-[#151C27] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FF6B00] hover:after:w-full after:transition-all"
          >
            Ensino Fundamental
          </button>
          <button 
            onClick={() => onNavigateSection('medio')}
            className="text-sm font-semibold text-gray-600 hover:text-[#151C27] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FF6B00] hover:after:w-full after:transition-all"
          >
            Ensino Médio
          </button>
          <button 
            onClick={() => onNavigateSection('olimpiadas')}
            className="text-sm font-semibold text-gray-600 hover:text-[#151C27] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FF6B00] hover:after:w-full after:transition-all"
          >
            Olimpíadas & Exames
          </button>
          <button 
            onClick={onOpenHistory}
            className="text-sm font-semibold text-gray-600 hover:text-[#FF6B00] transition-colors py-1 flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-gray-400" />
            <span>Meu Histórico</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Free Access Badge */}
          <div className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <LockOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acesso 100% Livre</span>
          </div>

          {/* Direct CTA Button */}
          <button
            onClick={onStartQuickExam}
            className="inline-flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#E05D00] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(255,107,0,0.35)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-white fill-current" />
            <span>Fazer Simulado Rápido</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Sem necessidade de cadastro! Todos os simulados liberados na hora.</span>
          </div>
          <button 
            onClick={() => { onNavigateSection('inicio'); setMobileMenuOpen(false); }}
            className="w-full text-left font-semibold text-gray-800 hover:text-[#FF6B00] py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Início</span>
          </button>
          <button 
            onClick={() => { onNavigateSection('fundamental'); setMobileMenuOpen(false); }}
            className="w-full text-left font-semibold text-gray-800 hover:text-[#FF6B00] py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Ensino Fundamental (6º ao 9º)</span>
            <BookOpen className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => { onNavigateSection('medio'); setMobileMenuOpen(false); }}
            className="w-full text-left font-semibold text-gray-800 hover:text-[#FF6B00] py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Ensino Médio (ENEM & Provão)</span>
            <GraduationCap className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => { onNavigateSection('olimpiadas'); setMobileMenuOpen(false); }}
            className="w-full text-left font-semibold text-gray-800 hover:text-[#FF6B00] py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Olimpíadas (OBMEP & OBA)</span>
            <Award className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => { onOpenHistory(); setMobileMenuOpen(false); }}
            className="w-full text-left font-semibold text-gray-800 hover:text-[#FF6B00] py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between"
          >
            <span>Meu Histórico de Simulados</span>
            <History className="w-4 h-4 text-gray-400" />
          </button>
          <div className="pt-2">
            <button
              onClick={() => { onStartQuickExam(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold py-3 rounded-xl shadow-md"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Iniciar Simulado Imediato</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
