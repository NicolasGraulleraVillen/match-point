import { Trophy, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6" />
              <span className="text-xl font-bold">
                Match<span className="text-secondary">Point</span>
              </span>
            </div>
            <p className="text-sm text-accent-foreground/80">
              Conectando estudiantes universitarios a través del deporte.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#about" className="hover:text-secondary transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="#how-it-works" className="hover:text-secondary transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link to="#sports" className="hover:text-secondary transition-colors">
                  Deportes
                </Link>
              </li>
              <li>
                <Link to="#contact" className="hover:text-secondary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">Síguenos</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-accent-foreground/20 mt-8 pt-8 text-center text-sm text-accent-foreground/60">
          <p>Copyright © 2025 MatchPoint. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
