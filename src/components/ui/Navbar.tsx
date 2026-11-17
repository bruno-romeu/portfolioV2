import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
    { label: 'Início', href: '#hero' },
    { label: 'Sobre', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projetos', href: '#projects' },
    { label: 'Contato', href: '#contact' },
];

const MOBILE_MENU_ID = 'mobile-menu';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fecha o menu mobile ao voltar para o layout desktop (breakpoint md = 768px)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsOpen(false);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Fecha o menu mobile com Esc
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Seção a rolar depois que o menu mobile terminar de fechar: a animação de saída
    // do menu cancela uma rolagem suave iniciada durante ela.
    const pendingHref = useRef<string | null>(null);

    const scrollTo = (href: string) => {
        if (href === '#hero') {
            window.scrollTo({ top: 0 });
            return;
        }
        document.querySelector(href)?.scrollIntoView();
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (isOpen) {
            pendingHref.current = href;
            setIsOpen(false);
            return;
        }
        scrollTo(href);
    };

    const handleMenuExitComplete = () => {
        const href = pendingHref.current;
        pendingHref.current = null;
        if (href) scrollTo(href);
    };

    const solidBackground = scrolled || isOpen;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            aria-label="Navegação principal"
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
                solidBackground
                    ? 'bg-[#121212]/80 backdrop-blur-lg border-white/10'
                    : 'border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <a
                    href="#hero"
                    onClick={(e) => scrollToSection(e, '#hero')}
                    aria-label="Bruno Romeu - voltar ao início"
                    className="group flex items-center text-xl font-bold text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                >
                    <span className="transition-colors duration-300 group-hover:text-blue-400">&lt;</span>

                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100 group-hover:px-1 group-focus-visible:max-w-[150px] group-focus-visible:opacity-100 group-focus-visible:px-1">
                        Bruno Romeu
                    </span>

                    <span className="transition-colors duration-300 group-hover:text-blue-400">/&gt;</span>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className="text-sm text-white hover:opacity-60 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#121212]"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    aria-controls={MOBILE_MENU_ID}
                    aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
                    className="md:hidden p-2 -mr-2 rounded-md text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                    {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>
            </div>

            <AnimatePresence onExitComplete={handleMenuExitComplete}>
                {isOpen && (
                    <motion.div
                        id={MOBILE_MENU_ID}
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden bg-[#121212]/95 backdrop-blur-lg border-t border-white/10"
                    >
                        <ul className="flex flex-col px-6 py-4 gap-1">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className="block rounded-lg px-3 py-3 text-base text-white hover:bg-white/10 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
