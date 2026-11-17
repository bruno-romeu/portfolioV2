import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { Chat, useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { AlertTriangle, Send, Square, RotateCcw } from 'lucide-react';
import { ChatMarkdown } from './ChatMarkdown';
import { getChatErrorMessage } from './chatError';
import { focusRing } from './styles';

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

// Instância única no nível do módulo: o painel é desmontado ao fechar o chat,
// mas a conversa (mensagens, status, erro e streaming em andamento) vive aqui
// e é retomada ao reabrir.
const chat = new Chat<UIMessage>({});

type ChatPanelProps = {
  input: string;
  onInputChange: (value: string) => void;
};

/**
 * Corpo pesado do chat (lista de mensagens + formulário). Carregado sob demanda
 * via React.lazy pelo ChatWidget e renderizado dentro do dialog dele.
 */
export function ChatPanel({ input, onInputChange }: ChatPanelProps) {
  const { messages, sendMessage, status, error, regenerate, stop, clearError } = useChat({ chat });
  const prefersReducedMotion = useReducedMotion();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  const isLoading = status === 'submitted' || status === 'streaming';
  const lastMessage = messages.at(-1);
  const assistantHasText =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts.some(part => part.type === 'text' && part.text.trim().length > 0);
  const showTyping = status === 'submitted' || (status === 'streaming' && !assistantHasText);

  // O painel só é montado com o chat aberto: foca o input e vai para o fim da conversa.
  useEffect(() => {
    inputRef.current?.focus();
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

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
    onInputChange('');
  };

  const handleRetry = () => {
    stickToBottomRef.current = true;
    void regenerate();
  };

  return (
    <>
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
            onChange={(e) => onInputChange(e.target.value)}
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
    </>
  );
}
