import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { AlertTriangle, MessageCircle, X, Send, Bot } from 'lucide-react';


export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir chat sobre o Bruno"
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/30 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] max-h-[80vh] bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="flex items-center justify-between p-4 bg-[#232323] border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-600/20 rounded-full text-purple-400">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Bruno AI</h3>
                  <p className="text-xs text-gray-400">Demonstração com RAG sobre meu perfil</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Fechar chat"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
              <p>
                As respostas podem conter erros ou interpretações imprecisas da IA. Use este chat como demonstração e,
                para confirmações, fale comigo por LinkedIn ou e-mail.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  Olá! Sou a IA do Bruno. Pergunte sobre projetos, experiências, stack ou trajetória.
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-[#2a2a2a] text-slate-200 border border-gray-700 rounded-tl-none'
                    }`}>
                      {m.parts.map((part, index) => 
                        part.type === 'text' ? <span key={index}>{part.text}</span> : null
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a2a] text-slate-200 border border-gray-700 p-3 rounded-2xl rounded-tl-none text-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="p-3 border-t border-gray-800 bg-[#1a1a1a]">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ex: Qual sua experiência com React?"
                  className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  aria-label="Enviar mensagem"
                  className="absolute right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
