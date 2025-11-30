import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { NavLink } from './NavLink';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';

export const Navbar = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-8" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/perfil">Perfil</NavLink>
            <NavLink to="/ranking">Ranking</NavLink>
            <NavLink to="/historial">Historial</NavLink>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/perfil">Perfil</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/ranking">Ranking</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/historial">Historial</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm mt-2"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
