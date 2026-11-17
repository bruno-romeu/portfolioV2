import Markdown, { type Components } from 'react-markdown';

// HTML cru é ignorado por padrão (sem rehype-raw) e URLs perigosas
// (ex.: javascript:) são neutralizadas pelo urlTransform padrão.
const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="marker:text-purple-400">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-50">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-purple-400 underline underline-offset-2 hover:text-purple-300 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-purple-400"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-[0.85em] text-purple-200">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-black/40 p-2 text-xs last:mb-0 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  h1: ({ children }) => <p className="mb-2 font-semibold text-slate-50">{children}</p>,
  h2: ({ children }) => <p className="mb-2 font-semibold text-slate-50">{children}</p>,
  h3: ({ children }) => <p className="mb-2 font-semibold text-slate-50">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-purple-500/60 pl-3 text-slate-300 last:mb-0">{children}</blockquote>
  ),
};

export function ChatMarkdown({ text }: { text: string }) {
  return (
    <div className="break-words">
      <Markdown components={components}>{text}</Markdown>
    </div>
  );
}
