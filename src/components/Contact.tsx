import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { FileDown, Mail, MapPin, Phone } from 'lucide-react';
import { RESUME_FILENAME, RESUME_URL } from '../resume';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 text-slate-100 bg-[#121212] overflow-hidden relative">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Vamos Conversar?</h2>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl">
          Estou aberto a conversas sobre oportunidades, projetos e colaboração em desenvolvimento web,
          backend, APIs, automações e soluções com dados. Se quiser falar comigo sem depender da IA do
          portfólio, meus contatos estão logo abaixo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.a
            href="mailto:contatobrunoromeu@gmail.com"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/[0.07] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <div className="p-3 rounded-full bg-white/10 text-purple-400">
              <Mail size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="font-medium break-all">contatobrunoromeu@gmail.com</p>
            </div>
          </motion.a>

          <motion.a
            href="tel:+5551996065712"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/[0.07] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <div className="p-3 rounded-full bg-white/10 text-purple-400">
              <Phone size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Telefone</p>
              <p className="font-medium">+55 (51) 99606-5712</p>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="p-3 rounded-full bg-white/10 text-purple-400">
              <MapPin size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Localização</p>
              <p className="font-medium">Porto Alegre, RS - Brasil</p>
            </div>
          </motion.div>

          <motion.a
            href={RESUME_URL}
            download={RESUME_FILENAME}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-purple-400/30 bg-purple-500/10 hover:border-purple-400/60 hover:bg-purple-500/15 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <div className="p-3 rounded-full bg-white/10 text-purple-400">
              <FileDown size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Currículo</p>
              <p className="font-medium">Baixar PDF</p>
            </div>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
