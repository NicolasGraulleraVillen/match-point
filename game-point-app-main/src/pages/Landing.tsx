import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Trophy, Users, TrendingUp, Calendar, Target, Zap, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(174,228,123,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-center">
              <Logo className="h-16 w-16 sm:h-20 sm:w-20" showText={false} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 text-balance px-4">
              Conecta. Compite. Mejora.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 text-balance px-4">
              La plataforma que une a estudiantes universitarios para practicar deporte juntos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" variant="secondary" asChild className="text-base sm:text-lg w-full sm:w-auto">
                <Link to="/login">
                  <ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Empezar ahora
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary text-base sm:text-lg w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Descargar la app
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Conoce MatchPoint */}
      <section id="about" className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            Conoce <span className="text-primary">MatchPoint</span>
          </h2>
          <p className="text-base sm:text-xl text-center text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Descubre nuestra visión y cómo estamos transformando el deporte universitario
          </p>
        </div>
      </section>

      {/* El problema es real */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">El problema es real</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Practicar deporte en la universidad debería ser fácil, pero la realidad es otra.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Difícil encontrar rivales', desc: 'No sabes quién está disponible o a tu nivel' },
              { icon: Calendar, title: 'Organización complicada', desc: 'Coordinar horarios y pistas es un dolor de cabeza' },
              { icon: Zap, title: 'Comunicación dispersa', desc: 'WhatsApp, Instagram... todo está desorganizado' },
              { icon: TrendingUp, title: 'Sin seguimiento', desc: 'No hay forma de ver tu progreso o estadísticas' },
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <item.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Los números hablan */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Los números hablan</h2>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Más de 80% de los estudiantes quieren competir. MatchPoint lo hace posible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '87%', title: 'De interés en la plataforma', desc: 'Los estudiantes quieren una solución como MatchPoint' },
              { number: '82%', title: 'Practica deporte regularmente', desc: 'La comunidad universitaria es activa y deportiva' },
              { number: '81%', title: 'Participaría activamente', desc: 'Si se facilitan los medios y la organización' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">{stat.number}</div>
                <h3 className="text-xl font-bold mb-2">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">¿Cómo funciona?</h2>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Empieza a competir en 3 simples pasos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { num: '1', title: 'Crea tu perfil deportivo', desc: 'Registra tus deportes favoritos, nivel de habilidad y disponibilidad.' },
              { num: '2', title: 'Encuentra rivales de tu nivel', desc: 'Nuestro algoritmo te conecta con jugadores compatibles según tu perfil.' },
              { num: '3', title: 'Compite y escala en el ranking', desc: 'Juega partidos, mejora tus estadísticas y sube en el ranking universitario.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* La solución que necesitas */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">La solución que necesitas</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            MatchPoint simplifica todo el proceso para que te centres en lo importante: jugar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Emparejamiento inteligente', desc: 'Algoritmo que conecta jugadores del mismo nivel', icon: Target },
              { title: 'Organización instantánea', desc: 'Crea o únete a partidos en segundos', icon: Zap },
              { title: 'Sigue tu evolución', desc: 'Estadísticas detalladas y ranking en tiempo real', icon: TrendingUp },
              { title: 'Todo en una app', desc: 'Perfil, partidos, ranking y comunicación centralizada', icon: CheckCircle },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
                <feature.icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Por qué MatchPoint? */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">¿Por qué MatchPoint?</h2>
          <p className="text-lg text-center mb-12 max-w-2xl mx-auto opacity-90">
            La forma más inteligente de conectar, competir y mejorar en el deporte universitario.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Emparejamiento justo', desc: 'Algoritmo inteligente que te conecta con rivales de tu mismo nivel y experiencia.' },
              { title: 'Reserva de pistas fácil', desc: 'Reserva instalaciones deportivas directamente desde la app en pocos clics.' },
              { title: 'Ranking y estadísticas', desc: 'Sigue tu progreso, consulta tus estadísticas y mejora tu rendimiento.' },
              { title: 'Comunidad activa', desc: 'Únete a una red de estudiantes deportistas apasionados como tú.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-background/10 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="opacity-80">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Deja de buscar partidos y empieza a jugarlos.
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            No esperes más para encontrar tu próximo rival y llevar tu juego al siguiente nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button size="lg" className="text-lg" asChild>
              <Link to="/login">
                <Download className="mr-2 h-5 w-5" />
                Descargar la app
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link to="/login">
                <ArrowRight className="mr-2 h-5 w-5" />
                Ver el MVP
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Únete a cientos de estudiantes que ya están compitiendo.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
