'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Lightbulb, 
  RotateCcw, 
  HelpCircle,
  Minimize2,
  Maximize2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Question } from '@/data/exams';

interface Message {
  id: string;
  sender: 'professor' | 'user';
  text: string;
  timestamp: string;
}

interface ProfEscudeiroWidgetProps {
  currentQuestion?: Question | null;
  examTitle?: string;
}

export default function ProfEscudeiroWidget({
  currentQuestion,
  examTitle,
}: ProfEscudeiroWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'professor',
      text: 'Olá! Eu sou o Prof. Escudeiro, seu professor online aqui no ESCSIMULADOS. Estou sempre por aqui para tirar qualquer dúvida sobre as questões, explicar regras, fórmulas e estratégias para você mandar bem nas provas. Em que posso te ajudar agora?',
      timestamp: 'Agora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          currentQuestion: currentQuestion || null,
          examTitle: examTitle || null,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Estou à disposição para orientar seus estudos!';

      const profMsg: Message = {
        id: `prof_${Date.now()}`,
        sender: 'professor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, profMsg]);
    } catch (err) {
      console.error('Erro ao consultar Prof. Escudeiro:', err);
      const errorMsg: Message = {
        id: `prof_err_${Date.now()}`,
        sender: 'professor',
        text: 'Tive uma pequena oscilação de conexão, mas uma ótima dica para este tipo de questão é destacar os dados numéricos e eliminar alternativas que fogem do bom senso.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <aside aria-label="Suporte com Prof. Escudeiro" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Pop-up Window */}
      {isOpen && (
        <div 
          className="mb-3 w-[92vw] sm:w-[400px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fadeIn transition-all"
          style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#151C27] via-[#2A313D] to-[#151C27] text-white p-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#151C27]" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white leading-tight">
                    Prof. Escudeiro
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <span className="text-xs text-gray-300">
                  Professor Online ESCSIMULADOS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages([
                  {
                    id: 'welcome_reset',
                    sender: 'professor',
                    text: 'Conversa limpa! Pode me fazer uma nova pergunta sobre qualquer matéria ou questão.',
                    timestamp: 'Agora',
                  }
                ])}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title="Limpar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Question Context Strip (if any) */}
          {currentQuestion && (
            <div className="bg-orange-50 px-3.5 py-2 border-b border-orange-100 flex items-center justify-between gap-2 text-xs text-orange-950 font-medium">
              <div className="flex items-center gap-1.5 truncate">
                <BookOpen className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" />
                <span className="truncate">
                  Focado em: <strong>{currentQuestion.subject}</strong> ({currentQuestion.skillCode})
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#FF6B00] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                Ativo
              </span>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9F9FF]">
            {messages.map((msg) => {
              const isProf = msg.sender === 'professor';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isProf ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {isProf && (
                      <div className="w-6 h-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-2xs">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isProf
                          ? 'bg-white text-gray-900 border border-gray-200/80 shadow-xs'
                          : 'bg-[#FF6B00] text-white shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs pl-8">
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-bounce delay-300" />
                  <span className="text-[11px] text-gray-500 ml-1">Prof. Escudeiro está pensando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {currentQuestion ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Professor, pode me dar uma dica sobre como começar a resolver esta questão?')}
                  className="text-[11px] whitespace-nowrap bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-semibold px-2.5 py-1 rounded-full border border-orange-200 transition-colors flex items-center gap-1"
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>Dica da questão</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Como posso eliminar alternativas erradas nesta questão?')}
                  className="text-[11px] whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-2.5 py-1 rounded-full transition-colors"
                >
                  Eliminar alternativas
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Como faço para calcular porcentagem de cabeça de forma rápida?')}
                  className="text-[11px] whitespace-nowrap bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-semibold px-2.5 py-1 rounded-full border border-orange-200 transition-colors flex items-center gap-1"
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>Dica rápida de Matemática</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Qual é o melhor método para interpretar textos longos no ENEM?')}
                  className="text-[11px] whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-2.5 py-1 rounded-full transition-colors"
                >
                  Dica para o ENEM
                </button>
              </>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida para o Prof. Escudeiro..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 bg-gray-50 focus:bg-white text-gray-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center ${
                inputText.trim() && !isLoading
                  ? 'bg-[#FF6B00] text-white hover:bg-[#E05D00] shadow-md shadow-orange-500/20 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#151C27] via-[#1E2738] to-[#151C27] hover:from-[#FF6B00] hover:to-[#E05D00] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border-2 border-white/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        style={{ boxShadow: '0 10px 25px -5px rgba(255,107,0,0.4), 0 8px 10px -6px rgba(0,0,0,0.3)' }}
      >
        <div className="relative">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FF6B00] group-hover:bg-white text-white group-hover:text-[#FF6B00] flex items-center justify-center transition-colors shadow-sm">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#151C27] animate-pulse" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-xs text-white">
              Prof. Escudeiro
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] text-gray-300 group-hover:text-white/90">
            Tire dúvidas online
          </span>
        </div>
      </button>

    </aside>
  );
}
