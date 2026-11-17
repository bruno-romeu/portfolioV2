import { Github, Linkedin, Mail } from 'lucide-react';

const links = [
  { href: 'https://github.com/bruno-romeu', label: 'GitHub', icon: Github, external: true },
  { href: 'https://www.linkedin.com/in/bruno-romeu-silva', label: 'LinkedIn', icon: Linkedin, external: true },
  { href: 'mailto:contatobrunoromeu@gmail.com', label: 'Email', icon: Mail, external: false },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] border-t border-white/10 px-6 pt-8 pb-28 sm:pb-8 sm:pr-28">
      <div className="max-w-4xl mx-auto flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-400 text-center sm:text-left">
          © {year} Bruno Romeu da Silva. Todos os direitos reservados.
        </p>

        <ul className="flex items-center gap-2">
          {links.map(({ href, label, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
