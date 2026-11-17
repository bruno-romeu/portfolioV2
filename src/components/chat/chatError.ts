export const GENERIC_CHAT_ERROR = 'Não consegui responder agora. Tente novamente em instantes.';

/**
 * O transporte padrão do AI SDK (DefaultChatTransport) lança
 * `new Error(await response.text())` quando a resposta não é 2xx.
 * O backend responde `{ "error": "<mensagem amigável>" }`, então tentamos
 * extrair esse campo; qualquer outra coisa vira a mensagem genérica.
 */
export function getChatErrorMessage(error: Error | undefined): string {
  if (!error) return GENERIC_CHAT_ERROR;
  try {
    const parsed: unknown = JSON.parse(error.message);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'error' in parsed &&
      typeof parsed.error === 'string' &&
      parsed.error.trim()
    ) {
      return parsed.error.trim();
    }
  } catch {
    // não é JSON (falha de rede, HTML de erro etc.)
  }
  return GENERIC_CHAT_ERROR;
}
