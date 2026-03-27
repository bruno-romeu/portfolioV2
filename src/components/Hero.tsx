import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 relative bg-[#121212] overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base mb-4 text-gray-600"
        >
          Olá, eu sou
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white"
        >
          Bruno Romeu da Silva
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl lg:text-4xl mb-6 text-purple-400 drop-shadow-[0_8px_10px_rgba(147,51,234,0.5)]"
        >
          Desenvolvedor Full Stack
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base md:text-lg max-w-2xl mb-8 text-gray-400 leading-relaxed"
        >
          Artesão de software focado em criar soluções robustas e escaláveis.
          Atualmente trabalhando com Laravel, React, Python e tecnologias modernas
          para entregar valor real aos projetos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 mb-12"
        >
          <a
            href="https://github.com/bruno-romeu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-border hover:border-gray-400/50 transition-all hover:scale-110 text-white"
            aria-label="GitHub"
          >
            <Github size={24} className='hover:text-blue-400 transition-colors'/>
          </a>
          <a
            href="https://www.linkedin.com/in/bruno-romeu-silva"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-border hover:border-gray-400/50 transition-all hover:scale-110 text-white"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} className='hover:text-blue-400 transition-colors'/>
          </a>
          <a
            href="mailto:contatobrunoromeu@gmail.com"
            className="p-3 rounded-full border border-border hover:border-gray-400/50 transition-all hover:scale-110 text-white"
            aria-label="Email"
          >
            <Mail size={24} className='hover:text-blue-400 transition-colors'/>
          </a>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => scrollToSection('about')}
          className="px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform text-semibold"
        >
          Ver mais sobre mim
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        className="absolute bottom-8"
      >
        <ArrowDown size={32} className="text-gray-400 cursor-pointer" onClick={() => scrollToSection('about')} />
      </motion.div>
    </section>
  );
}
