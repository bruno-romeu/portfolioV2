import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { AlertTriangle, MessageCircle, X, Bot, Loader2, RotateCcw } from 'lucide-react';
import { loadChatPanel, prefetchChatPanel, scheduleIdlePrefetch } from './chat/loadChatPanel';
import { focusRing } from './chat/styles';

// Pré-carrega o painel quando o navegador estiver ocioso, alguns segundos após o load.
const IDLE_PREFETCH_DELAY_MS = 4000;

const createLazyChatPanel = () => lazy(() => loadChatPanel().then(m => ({ default: m.ChatPanel })));

/** Rodapé com as mesmas dimensões do formulário real, para não haver salto de layout. */
function InputPlaceholder() {
  return (
    <div className="p-3 border-t border-gray-800 bg-[#1a1a1a]" aria-hidden="true">
      <input
        disabled
        tabIndex={-1}
        placeholder="Ex: Qual sua experiência com React?"
        className="w-full min-w-0 bg-[#2a2a2a] text-white border border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm opacity-60"
      />
    </div>
  );
}

function ChatPanelLoading() {
  return (
    <>
      <div role="status" className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-sm text-gray-400">
        <Loader2 size={24} className="motion-safe:animate-spin text-purple-400" aria-hidden="true" />
        <p>Carregando assistente…</p>
      </div>
      <InputPlaceholder />
    </>
  );
}

function ChatPanelLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
          <div className="flex gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-300" aria-hidden="true" />
            <p className="min-w-0 break-words">
              Não consegui carregar o assistente. Verifique sua conexão e tente novamente.
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onRetry}
              className={`flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700 ${focusRing}`}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
      <InputPlaceholder />
    </>
  );
}

type BoundaryProps = { children: ReactNode; onRetry: () => void };

/** Captura falha no download do chunk do painel (ex.: rede) sem derrubar a página. */
class ChatPanelBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <ChatPanelLoadError onRetry={this.props.onRetry} />;
    return this.props.children;
  }
}

/**
 * Launcher leve do chat: botão flutuante, listener de `open-chat`, estado
 * aberto/fechado e a moldura do dialog. O corpo pesado (useChat, markdown)
 * vem de um chunk separado carregado na primeira abertura (ou antes, via prefetch).
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [LazyChatPanel, setLazyChatPanel] = useState(createLazyChatPanel);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const launcherRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  // Abre o chat a partir de outras partes do site: window.dispatchEvent(new CustomEvent('open-chat'))
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpen);
    return () => window.removeEventListener('open-chat', handleOpen);
  }, []);

  useEffect(() => scheduleIdlePrefetch(IDLE_PREFETCH_DELAY_MS), []);

  // Foco: ao abrir, o painel foca o próprio input quando monta; enquanto ele
  // carrega, o foco fica no dialog. Ao fechar, volta para o botão flutuante.
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      const dialog = dialogRef.current;
      if (dialog && !dialog.contains(document.activeElement)) dialog.focus();
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

  const handleRetryLoad = () => {
    setLazyChatPanel(() => createLazyChatPanel());
    setLoadAttempt(n => n + 1);
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
        onPointerEnter={prefetchChatPanel}
        onFocus={prefetchChatPanel}
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
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-widget-title"
            aria-describedby="chat-widget-subtitle"
            className="fixed inset-x-3 bottom-3 h-[min(560px,calc(100dvh-1.5rem))] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-80 md:w-96 sm:h-[500px] sm:max-h-[80vh] bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 outline-none"
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

            <ChatPanelBoundary key={loadAttempt} onRetry={handleRetryLoad}>
              <Suspense fallback={<ChatPanelLoading />}>
                <LazyChatPanel input={input} onInputChange={setInput} />
              </Suspense>
            </ChatPanelBoundary>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
