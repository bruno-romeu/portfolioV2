import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { AlertTriangle, MessageCircle, X, Send, Bot, Square, RotateCcw } from 'lucide-react';
import { ChatMarkdown } from './chat/ChatMarkdown';
import { getChatErrorMessage } from './chat/chatError';

const MAX_INPUT_LENGTH = 500;
const COUNTER_THRESHOLD = 400;
// Distância (px) do fim da lista abaixo da qual consideramos que o usuário "está no fim".
const STICK_TO_BOTTOM_THRESHOLD = 80;

const SUGGESTED_QUESTIONS = [
  'Quais são seus principais projetos?',
  'Qual sua experiência com backend?',
  'Quais tecnologias você usa no frontend?',
  'Como esse chat funciona?',
];

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, regenerate, stop, clearError } = useChat();
  const prefersReducedMotion = useReducedMotion();

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const hasOpenedRef = useRef(false);

  const isLoading = status === 'submitted' || status === 'streaming';
  const lastMessage = messages.at(-1);
  const assistantHasText =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts.some(part => part.type === 'text' && part.text.trim().length > 0);
  const showTyping = status === 'submitted' || (status === 'streaming' && !assistantHasText);

  // Abre o chat a partir de outras partes do site: window.dispatchEvent(new CustomEvent('open-chat'))
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpen);
    return () => window.removeEventListener('open-chat', handleOpen);
  }, []);

  // Foco: input ao abrir, botão flutuante ao fechar.
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      stickToBottomRef.current = true;
      inputRef.current?.focus();
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    } else if (hasOpenedRef.current) {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  // Esc fecha o painel.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-scroll para a última mensagem, sem brigar com o usuário se ele rolou para cima.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion || status === 'streaming' ? 'auto' : 'smooth',
    });
  }, [messages, status, error, prefersReducedMotion]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICK_TO_BOTTOM_THRESHOLD;
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    stickToBottomRef.current = true;
    void sendMessage({ text: trimmed.slice(0, MAX_INPUT_LENGTH) });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input);
    setInput('');
  };

  const handleRetry = () => {
    stickToBottomRef.current = true;
    void regenerate();
  };

  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 50, scale: 0.9 },
      };

  return (
    <>
      <motion.button
        ref={launcherRef}
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir chat sobre o Bruno"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/30 z-50 ${focusRing} ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...panelMotion}
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-widget-title"
            aria-describedby="chat-widget-subtitle"
            className="fixed inset-x-3 bottom-3 h-[min(560px,calc(100dvh-1.5rem))] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-80 md:w-96 sm:h-[500px] sm:max-h-[80vh] bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="flex items-center justify-between gap-2 p-4 bg-[#232323] border-b border-gray-800">
              <div className="flex min-w-0 items-center gap-2">
                <div className="shrink-0 p-2 bg-purple-600/20 rounded-full text-purple-400">
                  <Bot size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 id="chat-widget-title" className="font-semibold text-slate-100">Bruno AI</h3>
                  <p id="chat-widget-subtitle" className="truncate text-xs text-gray-400">
                    Demonstração com RAG sobre meu perfil
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar chat"
                className={`shrink-0 rounded-full p-1 text-gray-400 hover:text-white transition-colors ${focusRing}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
              <p>
                As respostas podem conter erros ou interpretações imprecisas da IA. Use este chat como demonstração e,
                para confirmações, fale comigo por LinkedIn ou e-mail.
              </p>
            </div>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              aria-live="polite"
              aria-busy={isLoading}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 [scrollbar-width:thin] [scrollbar-color:#374151_transparent]"
            >
              {messages.length === 0 ? (
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Olá! Sou a IA do Bruno. Pergunte sobre projetos, experiências, stack ou trajetória.</p>
                  <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Perguntas sugeridas">
                    {SUGGESTED_QUESTIONS.map(question => (
                      <li key={question}>
                        <button
                          type="button"
                          onClick={() => send(question)}
                          disabled={isLoading}
                          className={`rounded-full border border-purple-500/40 bg-purple-600/10 px-3 py-1.5 text-xs text-purple-200 transition-colors hover:bg-purple-600/25 hover:border-purple-400 disabled:opacity-50 ${focusRing}`}
                        >
                          {question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                messages.map(m => {
                  const text = m.parts
                    .map(part => (part.type === 'text' ? part.text : ''))
                    .join('');
                  if (m.role === 'assistant' && !text.trim()) return null;
                  return (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] min-w-0 p-3 rounded-2xl text-sm ${
                          m.role === 'user'
                            ? 'bg-purple-600 text-white rounded-tr-none whitespace-pre-wrap break-words'
                            : 'bg-[#2a2a2a] text-slate-200 border border-gray-700 rounded-tl-none'
                        }`}
                      >
                        <span className="sr-only">{m.role === 'user' ? 'Você: ' : 'Bruno AI: '}</span>
                        {m.role === 'user' ? text : <ChatMarkdown text={text} />}
                      </div>
                    </div>
                  );
                })
              )}

              {showTyping && (
                <div className="flex justify-start">
                  <div
                    className="bg-[#2a2a2a] text-slate-200 border border-gray-700 p-3 rounded-2xl rounded-tl-none text-sm flex gap-1 items-center"
                    role="status"
                  >
                    <span className="sr-only">Bruno AI está digitando…</span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full motion-safe:animate-bounce" aria-hidden="true" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full motion-safe:animate-bounce [animation-delay:150ms]" aria-hidden="true" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full motion-safe:animate-bounce [animation-delay:300ms]" aria-hidden="true" />
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100"
                >
                  <div className="flex gap-2">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-300" aria-hidden="true" />
                    <p className="min-w-0 break-words">{getChatErrorMessage(error)}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={clearError}
                      className={`rounded-full px-3 py-1.5 text-xs text-red-200 transition-colors hover:bg-red-500/15 ${focusRing}`}
                    >
                      Dispensar
                    </button>
                    {messages.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRetry}
                        className={`flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700 ${focusRing}`}
                      >
                        <RotateCcw size={14} aria-hidden="true" />
                        Tentar novamente
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="p-3 border-t border-gray-800 bg-[#1a1a1a]">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_INPUT_LENGTH}
                  aria-label="Digite sua pergunta para o Bruno AI"
                  aria-describedby={input.length > COUNTER_THRESHOLD ? 'chat-widget-counter' : undefined}
                  placeholder="Ex: Qual sua experiência com React?"
                  className="w-full min-w-0 bg-[#2a2a2a] text-white border border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500 focus-visible:border-purple-500 transition-colors"
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={() => void stop()}
                    aria-label="Parar resposta"
                    title="Parar"
                    className={`absolute right-2 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors ${focusRing}`}
                  >
                    <Square size={16} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Enviar mensagem"
                    className={`absolute right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors ${focusRing}`}
                  >
                    <Send size={16} />
                  </button>
                )}
              </div>
              {input.length > COUNTER_THRESHOLD && (
                <p
                  id="chat-widget-counter"
                  className={`mt-1 pr-3 text-right text-[11px] ${input.length >= MAX_INPUT_LENGTH ? 'text-amber-300' : 'text-gray-500'}`}
                >
                  {input.length}/{MAX_INPUT_LENGTH}
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
