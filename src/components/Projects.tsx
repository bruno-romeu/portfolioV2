import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ExternalLink, Github, MessageCircle } from 'lucide-react';

type Project = {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  image: string;
  github: string;
  featured?: boolean;
  chatDemo?: boolean;
};

const projects: Project[] = [
  {
    title: 'portfolioV2',
    subtitle: 'Portfólio com assistente de IA (RAG)',
    description:
      'Este portfólio, feito com React 19, TypeScript, Vite e Tailwind CSS. Inclui o "Bruno AI", um chat que responde perguntas sobre mim usando RAG: embeddings com sentence-transformers/all-MiniLM-L6-v2 via Hugging Face Inference, busca vetorial no Pinecone e geração com Llama 3.1 8B via Groq, com streaming pelo Vercel AI SDK em uma função serverless na Vercel.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'RAG', 'Pinecone', 'Groq', 'Vercel AI SDK'],
    image: 'https://opengraph.githubassets.com/portfolio/bruno-romeu/portfolioV2',
    github: 'https://github.com/bruno-romeu/portfolioV2',
    featured: true,
    chatDemo: true,
  },
  {
    title: 'flix-API-Django',
    subtitle: 'API RESTful de filmes',
    description:
      'API RESTful de filmes desenvolvida com Django REST Framework durante estudos avançados de Django, praticando models, serializers, endpoints e organização de uma aplicação backend.',
    tech: ['Python', 'Django', 'DRF', 'Backend'],
    image: 'https://opengraph.githubassets.com/portfolio/bruno-romeu/flix-API-Django',
    github: 'https://github.com/bruno-romeu/flix-API-Django',
  },
  {
    title: 'sge_laravel',
    subtitle: 'Sistema de gestão empresarial',
    description:
      'Sistema de gestão desenvolvido com Laravel, representando minha prática com aplicações web completas, organização de regras de negócio, persistência de dados e estruturação de fluxos administrativos.',
    tech: ['PHP', 'Laravel', 'Backend', 'Gestão'],
    image: 'https://opengraph.githubassets.com/portfolio/bruno-romeu/sge_laravel',
    github: 'https://github.com/bruno-romeu/sge_laravel',
  },
  {
    title: 'ETL-ecommerce',
    subtitle: 'Dados e IA aplicada',
    description:
      'Script de ETL em Python que consome dados da DummyJSON, identifica produtos com baixa avaliação e usa Gemini para sugerir melhorias em título, descrição e preço. Une consumo de APIs, tratamento de dados e IA aplicada.',
    tech: ['Python', 'ETL', 'Gemini API', 'Dados'],
    image: 'https://opengraph.githubassets.com/portfolio/bruno-romeu/ETL-ecommerce',
    github: 'https://github.com/bruno-romeu/ETL-ecommerce',
  },
  {
    title: 'bot_search_price',
    subtitle: 'Automação e web scraping',
    description:
      'Bot em Python com Selenium para monitorar produtos em plataformas de venda online, coletando título, preço e link. Mostra meu interesse por automação, coleta de dados e tarefas repetitivas resolvidas com software.',
    tech: ['Python', 'Selenium', 'Web Scraping', 'Automação'],
    image: 'https://opengraph.githubassets.com/portfolio/bruno-romeu/bot_search_price',
    github: 'https://github.com/bruno-romeu/bot_search_price',
  },
];

const linkBase =
  'inline-flex items-center gap-2 rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
const linkClass = `${linkBase} text-gray-900 hover:text-purple-700`;
const chatButtonClass = `${linkBase} text-purple-700 hover:text-purple-900 cursor-pointer`;

// As imagens do opengraph.githubassets.com são geradas sob demanda e às vezes falham
// no primeiro acesso; nesse caso mostramos um placeholder no lugar de um bloco preto.
function ProjectImage({ src, title, subtitle }: { src: string; title: string; subtitle: string }) {
  const [failed, setFailed] = useState(false);
  const base = 'w-full aspect-[1200/630] group-hover:scale-[1.02] transition-transform duration-300';

  if (failed) {
    return (
      <div
        className={`${base} flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 p-6 text-center`}
      >
        <Github size={32} className="text-purple-300" aria-hidden="true" />
        <span className="text-xl font-semibold text-white break-all">{title}</span>
        <span className="text-sm text-gray-300">{subtitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={`${base} object-cover`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function openChat() {
  window.dispatchEvent(new CustomEvent('open-chat'));
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-20 bg-slate-100">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full"
      >
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Projetos em destaque</h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Uma seleção de projetos públicos que mostram minha evolução com backend, APIs,
            automações, dados, IA aplicada, frontend e mobile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className={`group rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${
                project.featured
                  ? 'lg:col-span-2 lg:grid lg:grid-cols-2 border-purple-200 ring-1 ring-purple-100'
                  : 'border-gray-200'
              }`}
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-hidden="true"
                className="block bg-gray-950 overflow-hidden lg:flex lg:items-center"
              >
                <ProjectImage src={project.image} title={project.title} subtitle={project.subtitle} />
              </a>

              <div className={project.featured ? 'p-6 lg:p-8 lg:flex lg:flex-col lg:justify-center' : 'p-6'}>
                {project.featured && (
                  <span className="inline-block mb-3 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                    Destaque
                  </span>
                )}
                <p className="text-sm font-medium text-purple-700 mb-2">{project.subtitle}</p>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{project.title}</h3>
                <p className="text-base text-gray-600 mb-5 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <Github size={18} aria-hidden="true" />
                    <span>Ver código</span>
                  </a>
                  <a
                    href={`${project.github}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <ExternalLink size={18} aria-hidden="true" />
                    <span>README</span>
                  </a>
                  {project.chatDemo && (
                    <button type="button" onClick={openChat} className={chatButtonClass}>
                      <MessageCircle size={18} aria-hidden="true" />
                      <span>Testar o chat</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://github.com/bruno-romeu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
          >
            <Github size={18} aria-hidden="true" />
            <span>Ver todos no GitHub</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
