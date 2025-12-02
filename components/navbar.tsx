"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, Home, User, Trophy, Clock } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => logout();

  const navLinks = [
    { href: "/home", label: "Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/profile", label: "Perfil", icon: <User className="h-4 w-4 mr-2" /> },
    { href: "/ranking", label: "Ranking", icon: <Trophy className="h-4 w-4 mr-2" /> },
    { href: "/historial", label: "Historial", icon: <Clock className="h-4 w-4 mr-2" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="https://courtconnect-campus.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-extrabold text-primary hover:opacity-80 hover:scale-105 transition-all"
          >
            MatchPoint
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <Button variant="outline" onClick={handleLogout} size="sm">
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t border-border bg-background/95 backdrop-blur-sm rounded-b-lg shadow-md">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className={`w-full justify-start text-sm flex items-center ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={link.href}>
                  <span className="flex items-center">
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm mt-2 flex items-center"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
