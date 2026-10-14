'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Landmark, 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Scale
} from 'lucide-react';

interface BenchmarkLevel {
  id: 'nacional' | 'estadual' | 'municipal';
  categoryLabel: string;
  scopeBadge: string;
  title: string;
  source: string;
  mainMetricLabel: string;
  mainMetricValue: string;
  mainMetricSubtext: string;
  statusBadge: string;
  indicator1Name: string;
  indicator1Percent: number;
  indicator2Name: string;
  indicator2Percent: number;
  comparisonNote: string;
}

const BENCHMARKS: BenchmarkLevel[] = [
  {
    id: 'nacional',
    categoryLabel: 'Nacional',
    scopeBadge: 'MEC • Inep',
    title: 'IDEB & Matriz Nacional SAEB',
    source: 'Ministério da Educação / Inep • Dados Oficiais',
    mainMetricLabel: 'Meta IDEB Nacional',
    mainMetricValue: '6.2',
    mainMetricSubtext: 'Escala 0 a 10 • Ensino Fundamental & Médio',
    statusBadge: 'Parâmetro Oficial',
    indicator1Name: 'Língua Portuguesa (Proficiência Adequada)',
    indicator1Percent: 68,
    indicator2Name: 'Matemática (Resolução de Problemas)',
    indicator2Percent: 54,
    comparisonNote: 'Média de proficiência padrão para aprovação no Brasil',
  },
  {
    id: 'estadual',
    categoryLabel: 'Estadual',
    scopeBadge: 'São Paulo • Seduc',
    title: 'IDESP & Prova Paulista',
    source: 'Secretaria da Educação do Estado de SP (Seduc-SP)',
    mainMetricLabel: 'Índice IDESP Médio',
    mainMetricValue: '5.8',
    mainMetricSubtext: 'Padrão das Escolas Públicas Estaduais',
    statusBadge: 'Matriz SP',
    indicator1Name: 'Anos Finais EF (Currículo em Ação)',
    indicator1Percent: 74,
    indicator2Name: 'Ensino Médio & Provão Paulista',
    indicator2Percent: 69,
    comparisonNote: 'Índice referencial para vagas diretas na USP, Unesp e Fatecs',
  },
  {
    id: 'municipal',
    categoryLabel: 'Municipal / Técnico',
    scopeBadge: 'Redes Locais & ETECs',
    title: 'Vestibulinhos & Polos Municipais',
    source: 'Centros Técnicos Integrados (ETEC, IFs e Polos Locais)',
    mainMetricLabel: 'Corte Médio Técnico',
    mainMetricValue: '720',
    mainMetricSubtext: 'Escala TRI / Pontuação de Seleção',
    statusBadge: 'Concorrido',
    indicator1Name: 'Ciências da Natureza & Lógica',
    indicator1Percent: 82,
    indicator2Name: 'Linguagens & Interpretação',
    indicator2Percent: 78,
    comparisonNote: 'Aproveitamento médio para classificação em 1ª chamada',
  },
];

export default function StudentHeroCard() {
  const [activeTab, setActiveTab] = useState<'nacional' | 'estadual' | 'municipal'>('nacional');
  const current = BENCHMARKS.find((b) => b.id === activeTab) || BENCHMARKS[0];

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Ambient decorative card backing */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B00]/20 via-[#D9DFF5]/40 to-[#FF8533]/25 rounded-3xl transform rotate-2 scale-105 filter blur-xl pointer-events-none" />

      {/* Main Floating Glass Card */}
      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-7 flex flex-col gap-5">
        
        {/* Header Strip with Institutional Scope Selector */}
        <div className="flex flex-col gap-3 pb-3 bg-[#F0F3FF] -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 p-4 sm:p-5 rounded-t-3xl border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#151C27] text-white flex items-center justify-center shadow-xs">
                {current.id === 'nacional' && <Landmark className="w-5 h-5 text-orange-400" />}
                {current.id === 'estadual' && <Building2 className="w-5 h-5 text-blue-400" />}
                {current.id === 'municipal' && <MapPin className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-gray-500">
                  Base Oficial de Referência
                </span>
                <span className="font-heading text-sm sm:text-base text-[#151C27] font-bold">
                  Índices e Metas Educacionais
                </span>
              </div>
            </div>

            <span className="text-[11px] font-heading font-extrabold px-2.5 py-1 rounded-full bg-[#FFDBCC] text-[#7A3000] shadow-2xs">
              {current.scopeBadge}
            </span>
          </div>

          {/* Scope Selector Tabs (Nacional, Estadual, Municipal) */}
          <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-gray-200/80 shadow-2xs">
            {BENCHMARKS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveTab(b.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-heading font-bold transition-all text-center ${
                  activeTab === b.id
                    ? 'bg-[#151C27] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {b.categoryLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Benchmark Overview */}
        <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
              {current.source}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {current.statusBadge}
            </span>
          </div>

          <h3 className="font-heading text-base sm:text-lg text-[#151C27] font-extrabold">
            {current.title}
          </h3>

          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#FF6B00]" />
            <span>Padrão curricular oficial para calibração dos simulados</span>
          </p>
        </div>

        {/* Score Highlight with Progress Bar Chart */}
        <div className="grid grid-cols-12 gap-4 items-center bg-[#F0F3FF] p-4 sm:p-5 rounded-2xl border border-blue-50">
          <div className="col-span-5 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider">
              {current.mainMetricLabel}
            </span>
            <span className="font-heading text-3xl sm:text-4xl text-[#FF6B00] font-black leading-none pt-1">
              {current.mainMetricValue}
            </span>
            <span className="text-[11px] text-gray-500 pt-1 font-medium">
              {current.mainMetricSubtext}
            </span>
          </div>

          <div className="col-span-7 flex flex-col gap-2.5">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold pb-1">
                <span className="text-[#151C27] truncate pr-1">{current.indicator1Name}</span>
                <span className="text-[#FF6B00] font-bold">{current.indicator1Percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B00] rounded-full transition-all duration-700"
                  style={{ width: `${current.indicator1Percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold pb-1">
                <span className="text-[#151C27] truncate pr-1">{current.indicator2Name}</span>
                <span className="text-gray-600 font-bold">{current.indicator2Percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#575E70] rounded-full transition-all duration-700"
                  style={{ width: `${current.indicator2Percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Scale Footnote */}
        <div className="flex items-center justify-between px-1 text-xs text-gray-600">
          <span className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-none">{current.comparisonNote}</span>
          </span>
          <a href="#provas-cobertas" className="text-[#FF6B00] font-bold hover:underline flex items-center gap-1 flex-shrink-0">
            Ver Matriz →
          </a>
        </div>

      </div>
    </div>
  );
}
