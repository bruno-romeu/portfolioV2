type ChatPanelModule = typeof import('./ChatPanel');

let pending: Promise<ChatPanelModule> | null = null;

/**
 * Import dinâmico único do painel do chat (useChat + react-markdown).
 * Compartilhado entre o React.lazy e o prefetch, para que ambos usem o mesmo
 * chunk/promise. Se o download falhar, a promise é descartada para permitir
 * uma nova tentativa.
 */
export function loadChatPanel(): Promise<ChatPanelModule> {
  pending ??= import('./ChatPanel').catch((error: unknown) => {
    pending = null;
    throw error;
  });
  return pending;
}

/** Pré-carrega o chunk do painel sem tratar erro (o lazy tenta de novo ao abrir). */
export function prefetchChatPanel(): void {
  loadChatPanel().catch(() => {});
}

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

/**
 * Agenda o prefetch para quando o navegador estiver ocioso, alguns segundos
 * após o `load`, respeitando economia de dados / redes 2G.
 * Retorna uma função de cancelamento.
 */
export function scheduleIdlePrefetch(delayMs: number): () => void {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (connection?.saveData || connection?.effectiveType?.includes('2g')) return () => {};

  let timer: number | undefined;
  let idleId: number | undefined;

  const start = () => {
    timer = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(prefetchChatPanel, { timeout: 3000 });
      } else {
        prefetchChatPanel();
      }
    }, delayMs);
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  return () => {
    window.removeEventListener('load', start);
    if (timer !== undefined) window.clearTimeout(timer);
    if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleId);
    }
  };
}
