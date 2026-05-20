import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
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
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Projetos em destaque</h2>
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
              className="group rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="block bg-gray-950">
                <img
                  src={project.image}
                  alt={`Preview do repositório ${project.title}`}
                  className="w-full aspect-[1200/630] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </a>

              <div className="p-6">
                <p className="text-sm font-medium text-purple-700 mb-2">{project.subtitle}</p>
                <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-purple-700 transition-colors"
                  >
                    <Github size={18} />
                    <span>Ver código</span>
                  </a>
                  <a
                    href={`https://github.com/bruno-romeu/${project.title}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-purple-700 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>README</span>
                  </a>
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
            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
          >
            <Github size={18} />
            <span>Ver todos no GitHub</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
