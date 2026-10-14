'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Trash2, 
  Award, 
  Clock, 
  CheckCircle2, 
  Play, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

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

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchExamId: (examId: string) => void;
}

export default function HistoryModal({
  isOpen,
  onClose,
  onLaunchExamId,
}: HistoryModalProps) {
  const [history, setHistory] = useState<StoredExamResult[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('escsimulados_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const handleClearHistory = () => {
    if (confirm('Deseja apagar o histórico de simulados salvos neste navegador?')) {
      localStorage.removeItem('escsimulados_history');
      setHistory([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 via-white to-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#151C27] text-white flex items-center justify-center shadow-md">
              <History className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-[#151C27]">
                Seu Histórico de Simulados
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Salvo localmente em seu aparelho • 100% privado
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#151C27]">
                Nenhum simulado registrado ainda
              </h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Quando você finalizar seu primeiro simulado (ENEM, Prova Paulista, SARESP, OBMEP, etc.), os seus resultados e pontuações TRI aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-orange-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#151C27]">
                        {item.examTitle}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>Acertos: <strong>{item.score}/{item.total}</strong> ({item.percentage}%)</span>
                      <span>•</span>
                      <span className="text-[#FF6B00] font-bold font-mono">
                        TRI ~{item.estimatedTri} pts
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLaunchExamId(item.examId);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white text-xs font-heading font-bold transition-all self-end sm:self-center"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Fazer Novamente</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Histórico</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#151C27] hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
