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
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900">Sobre mim</h2>
        
        <div className="space-y-6 text-base md:text-lg text-gray-600 leading-relaxed">
          <p>
            Sou <strong className="text-gray-900 font-semibold">Desenvolvedor Fullstack na Infinilabs</strong> desde fevereiro de 2026.
            Antes da programação, trabalhei na área administrativa, onde cuidava de processos de financiamento imobiliário,
            e depois no suporte técnico de uma empresa de sistemas de gestão. Dessa trajetória ficou uma visão prática:
            entender o problema e o processo de quem usa o sistema antes de construir a solução.
          </p>

          <p>
            Na Infinilabs, fui o principal responsável por uma plataforma de gestão de riscos psicossociais para adequação
            à NR-1, do levantamento de requisitos com a cliente à prototipação, ao planejamento de sprints e à implementação,
            incluindo a modelagem e a documentação dos dados. Também desenvolvi em equipe um backoffice com perfis, permissões
            e integração com APIs externas, e contribuí no frontend e no CMS de um portal internacional.
          </p>

          <p>
            Minha stack principal é <strong className="text-gray-900 font-semibold">TypeScript e Python</strong>, com{' '}
            <strong className="text-gray-900 font-semibold">Next.js, NestJS, React, Laravel e Django</strong> e{' '}
            <strong className="text-gray-900 font-semibold">PostgreSQL</strong> como banco principal. Nos projetos pessoais
            do GitHub, também uso FastAPI, Docker e integrações com IA, como no Sinaliza, meu TCC.
          </p>

          <p>
            Construí minha base escrevendo código sem apoio de IA e hoje também desenvolvo com agentes, com um fluxo
            estruturado: especificação antes de começar, decisão registrada, teste contra o sistema real e revisão antes
            do merge. Curso <strong className="text-gray-900 font-semibold">Análise e Desenvolvimento de Sistemas na ULBRA</strong>,
            no 6º semestre, com conclusão prevista para dezembro de 2026.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
