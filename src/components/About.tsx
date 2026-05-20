import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-20 bg-slate-100">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Sobre mim</h2>
        
        <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            Sou estudante de <strong className="text-foreground font-semibold">Análise e Desenvolvimento de Sistemas na ULBRA</strong> e
            atuo como <strong className="text-foreground font-semibold">Desenvolvedor Full Stack</strong>. Minha trajetória passou por área administrativa e suporte técnico antes da programação, então carrego comigo uma visão bem prática: entender o problema, organizar o processo e construir uma solução que funcione no dia a dia.
          </p>

          <p>
            No backend, tenho afinidade com <strong className="text-foreground font-semibold">Python, Django, Django REST Framework, FastAPI, PHP e Laravel</strong>, principalmente para criação de APIs, regras de negócio, integrações e modelagem de dados. Também trabalho com bancos relacionais, com foco em <strong className="text-foreground font-semibold">PostgreSQL</strong> e familiaridade com MySQL, Oracle e SQL.
          </p>

          <p>
            No frontend, uso <strong className="text-foreground font-semibold">React, TypeScript, JavaScript, Tailwind CSS e Inertia.js</strong> para desenvolver interfaces responsivas e integradas ao backend. Também venho explorando projetos com Flutter, automações com Selenium, análise de dados com Python e integrações com IA, incluindo experimentos com a API Gemini.
          </p>

          <p>
            Gosto de aprender construindo. Meus projetos no GitHub refletem essa evolução: APIs com Django, e-commerce, web scraping, ETL com IA, estudos de dados, Flutter e aplicações web em PHP e React. Meu objetivo é crescer como full stack com uma base cada vez mais forte em backend, arquitetura e produtos que entreguem valor de verdade.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
