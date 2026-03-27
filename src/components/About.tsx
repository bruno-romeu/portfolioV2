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
            Sou estudante do <strong className="text-foreground font-semibold">5º semestre de Análise e Desenvolvimento de Sistemas na ULBRA</strong> e 
            atuo profissionalmente como Desenvolvedor Full Stack. Gosto de encarar cada projeto como uma oportunidade de construir algo que realmente funcione bem — com atenção à qualidade, curiosidade para aprender o que for necessário e disposição para escolher as ferramentas certas para cada desafio.
          </p>

          <p>
            No dia a dia, desenvolvo aplicações completas com <strong className="text-foreground font-semibold">Laravel, Inertia.js e React</strong>. No back-end, tenho uma base sólida em <strong className="text-foreground font-semibold">Python</strong>, com bastante experiência construindo APIs com <strong className="text-foreground font-semibold">Django e Django REST Framework</strong>, e tenho explorado o <strong className="text-foreground font-semibold">FastAPI</strong> com interesse crescente. Trabalho com bancos de dados relacionais com frequência, com foco em <strong className="text-foreground font-semibold">PostgreSQL</strong>, e com familiaridade em MySQL, Oracle e SQL.
          </p>

          <p>
            Ao longo da minha trajetória, fui desenvolvendo um conjunto de ferramentas que uso com naturalidade: <strong className="text-foreground font-semibold">Git</strong> para versionamento, <strong className="text-foreground font-semibold">Postman</strong> para testar APIs, <strong className="text-foreground font-semibold">Docker</strong> para containerização. Também já trabalhei com integrações de APIs externas (inclusive com recursos de inteligência artificial), automações via web scraping e aplico boas práticas de desenvolvimento no meu trabalho cotidiano.
          </p>

          <p>
            Antes de migrar para o desenvolvimento, trabalhei com suporte técnico — uma experiência que me ensinou a pensar de forma sistêmica e a resolver problemas com calma e método. Hoje, levo isso comigo enquanto busco crescer tanto no front-end quanto no back-end, sempre com vontade de contribuir com soluções que fazem a diferença de verdade.
          </p>
        </div>
      </motion.div>
    </section>
  );
}