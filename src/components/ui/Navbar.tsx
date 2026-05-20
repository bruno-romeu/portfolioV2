import { motion } from "motion/react"
import { useEffect, useState } from "react";

const navItems = [
        { label: 'Início', href: '#hero' },
        { label: 'Sobre', href: '#about' },
        { label: 'Skills', href: '#skills' },
        { label: 'Projetos', href: '#projects' },
        { label: 'Contato', href: '#contact' }

    ];

export default function Navbar() {
    const [, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);

        if (href === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth'});
            return;
        }

        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
    }
    
    return (
        <motion.nav
            initial={{ y: -100}}
            animate={{ y: 0}}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-[#121212]/50 backdrop-blur-lg border-b border-border border-transparent' : ''
            }`}
        >

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')}>
                    <motion.div
                        className="text-xl font-bold text-white group flex items-center cursor-pointer"
                    >
                        <span className="transition-colors duration-300 group-hover:text-blue-400">&lt;</span>

                        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100 group-hover:px-1">
                            Bruno Romeu
                        </span>
                        
                        <span className="transition-colors duration-300 group-hover:text-blue-400">/&gt;</span>
                    </motion.div>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <a 
                        key={item.href}
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.href)}
                        className="text-sm hover:opacity-60 transition-opacity text-white gap-6"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>



        </motion.nav>
    );
}
