import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const skills = [
  {
    category: 'Linguagens',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'SQL', 'HTML', 'CSS']
  },
  {
    category: 'Frontend',
    items: ['Next.js', 'React', 'Astro', 'Tailwind CSS', 'shadcn/ui', 'Bootstrap']
  },
  {
    category: 'Backend & CMS',
    items: ['NestJS', 'Laravel', 'Django', 'Django REST Framework', 'Passport', 'JWT', 'Strapi']
  },
  {
    category: 'Banco de Dados & ORM',
    items: ['PostgreSQL', 'MySQL', 'Prisma', 'Eloquent', 'Django ORM']
  },
  {
    category: 'DevOps & Ferramentas',
    items: ['Docker', 'Docker Compose', 'GitHub Actions', 'Git', 'GitHub', 'pnpm', 'Turborepo', 'Postman']
  },
  {
    category: 'IA & Produto',
    items: [
      'Desenvolvimento assistido por agentes',
      'Integração com APIs de IA',
      'Levantamento de requisitos',
      'Prototipação',
      'Modelagem de dados',
      'Planejamento de sprints'
    ]
  }
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center px-6 py-20 text-slate-100 bg-[#121212] overflow-hidden relative">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white">Skills & Tecnologias</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 shadow-md hover:scale-105 hover:bg-white/[0.07] hover:border-white/20 transition-all hover:shadow-blue-600/40 hover:shadow-2xl duration-300 ease-in-out"
            >
              <h3 className="text-xl font-semibold mb-4">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm rounded-full bg-white/10 text-gray-100 border border-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}