"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  //const router = useRouter()
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!currentUser) return null;

  const navLinks = [
    { href: "/home", label: "Dashboard" },
    { href: "/profile", label: "Perfil" },
    { href: "/ranking", label: "Ranking" },
    { href: "/historial", label: "Historial" },
  ];

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={currentUser ? "/home" : "/"} className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-8" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
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
          <div className="md:hidden py-3 space-y-1 border-t border-border">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className="w-full justify-start text-sm"
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
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
