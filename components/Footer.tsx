'use client';

import React from 'react';
import { GraduationCap, Users, Megaphone, PlayCircle, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectExam: (examId: string) => void;
}

export default function Footer({ onSelectExam }: FooterProps) {
  return (
    <footer className="w-full bg-[#151C27] text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4 pr-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                ESC<span className="text-[#FF6B00]">SIMULADOS</span>
              </span>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Plataforma líder e gratuita em preparação para exames fundamentais e médios: ENEM, SAEB, ETEC, OBMEP, Prova Paulista e vestibulares de alta concorrência.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Acesso democrático sem exigência de login ou cobrança</span>
            </div>

            {/* Social / Community Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#comunidade" 
                aria-label="Comunidade de Estudantes"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B00] hover:text-white text-gray-300 flex items-center justify-center transition-colors"
              >
                <Users className="w-4 h-4" />
              </a>
              <a 
                href="#noticias" 
                aria-label="Canal de Notícias e Editais"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B00] hover:text-white text-gray-300 flex items-center justify-center transition-colors"
              >
                <Megaphone className="w-4 h-4" />
              </a>
              <a 
                href="#videos" 
                aria-label="Vídeos de Resolução"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B00] hover:text-white text-gray-300 flex items-center justify-center transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Ensino Fundamental */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Ensino Fundamental
            </span>
            <button 
              onClick={() => onSelectExam('prova-paulista')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              Prova Paulista (6º ao 9º)
            </button>
            <button 
              onClick={() => onSelectExam('saresp')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              SARESP Fundamental
            </button>
            <button 
              onClick={() => onSelectExam('obmep')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              OBMEP Nível 1 & 2
            </button>
            <button 
              onClick={() => onSelectExam('oba')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              OBA Nível 3 (Astronomia)
            </button>
            <button 
              onClick={() => onSelectExam('etec')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              Vestibulinhos ETEC / IFs
            </button>
          </div>

          {/* Column 4: Ensino Médio */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Ensino Médio
            </span>
            <button 
              onClick={() => onSelectExam('enem')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              Simulado Completo ENEM
            </button>
            <button 
              onClick={() => onSelectExam('provao-paulista')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              Provão Paulista (USP/Unicamp)
            </button>
            <button 
              onClick={() => onSelectExam('obmep')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              OBMEP Nível 3
            </button>
            <button 
              onClick={() => onSelectExam('oba')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              OBA Nível 4
            </button>
            <button 
              onClick={() => onSelectExam('bolsoes')} 
              className="text-left text-sm text-gray-400 hover:text-[#FF6B00] transition-colors"
            >
              Concursos de Bolsas
            </button>
          </div>

          {/* Column 5: Institucional */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Institucional
            </span>
            <a href="#sobre" className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors">
              Sobre a Plataforma
            </a>
            <a href="#metodologia" className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors">
              Metodologia TRI & BNCC
            </a>
            <a href="#escolas" className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors">
              Para Professores e Escolas
            </a>
            <a href="#ajuda" className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors">
              Perguntas Frequentes
            </a>
            <a href="#contato" className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors">
              Contato & Ouvidoria
            </a>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 ESCSIMULADOS. Feito para fortalecer a educação básica pública e privada do Brasil.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-gray-400">Termos de Uso</span>
            <span className="text-gray-400">Política de Privacidade</span>
            <span className="text-gray-400">Segurança & LGPD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
