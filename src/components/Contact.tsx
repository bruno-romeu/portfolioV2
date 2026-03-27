import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 text-slate-100 bg-[#121212] overflow-hidden relative">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Vamos Conversar?</h2>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
          Estou sempre aberto a novas oportunidades e colaborações. 
          Se você tem um projeto em mente ou quer apenas bater um papo sobre tecnologia, 
          sinta-se à vontade para entrar em contato!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.a
            href="mailto:contatobrunoromeu@gmail.com"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-card hover:border-muted-foreground/50 transition-all hover:scale-105"
          >
            <div className="p-3 rounded-full bg-muted">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">contatobrunoromeu@gmail.com</p>
            </div>
          </motion.a>

          <motion.a
            href="tel:+5551996065712"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-card hover:border-muted-foreground/50 transition-all hover:scale-105"
          >
            <div className="p-3 rounded-full bg-muted">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Telefone</p>
              <p className="font-medium">+55 (51) 99606-5712</p>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-card md:col-span-2"
          >
            <div className="p-3 rounded-full bg-muted">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Localização</p>
              <p className="font-medium">Porto Alegre, RS - Brasil</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-12 border-t border-border"
        >
          <p className="text-muted-foreground">
            © 2026 Bruno Romeu da Silva. Todos os direitos reservados.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}