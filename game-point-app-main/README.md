# Match Point MVP

Una plataforma web para conectar estudiantes universitarios deportistas. Encuentra rivales de tu nivel, organiza partidos y compite en rankings universitarios.

## 🚀 Características

- **Múltiples deportes**: Fútbol, Baloncesto, Tenis y Pádel
- **Gestión de partidos**: Crea y únete a partidos fácilmente
- **Sistema de equipos**: Para deportes en equipo (Fútbol y Baloncesto)
- **Rankings**: Compite y sube en el ranking universitario
- **Historial**: Revisa todos tus partidos pasados
- **Perfiles deportivos**: Estadísticas detalladas al estilo FIFA
- **Niveles**: Novato, Intermedio y Pro

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repo-url>

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 🛠️ Stack Tecnológico

- **React** + **Vite** - Framework y build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos
- **Shadcn UI** - Componentes UI
- **React Router** - Navegación
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── ui/           # Componentes de Shadcn UI
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MatchCard.tsx
│   └── CreateMatchModal.tsx
├── contexts/         # Context API para estado global
│   └── AppContext.tsx
├── mocks/           # Datos de prueba
│   ├── data.ts
│   └── README.md
├── pages/           # Páginas de la aplicación
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── History.tsx
│   ├── Ranking.tsx
│   └── NotFound.tsx
├── types/           # Tipos TypeScript
│   └── index.ts
├── utils/           # Utilidades
│   └── sportIcons.tsx
├── App.tsx          # Componente raíz
├── main.tsx         # Punto de entrada
└── index.css        # Estilos globales
```

## 🎨 Paleta de Colores

El proyecto utiliza una paleta verde temática deportiva:

- **Primary**: #5D982A (Verde Oliva)
- **Secondary**: #AEE47B (Verde Claro)
- **Accent**: #3C641B (Verde Oscuro)
- **Highlight**: #98942A (Verde Amarillento)

## 🔐 Autenticación (Mock)

La aplicación NO tiene backend real. La autenticación es simulada:

- **Login**: Cualquier email/password te logea como usuario de prueba
- **Register**: Crea un nuevo usuario en memoria

El usuario se guarda en `localStorage` para persistir entre sesiones.

## 📊 Datos Mock

Todos los datos están en `/src/mocks/data.ts`:

- **Usuarios**: 1 usuario principal + referencias a otros
- **Partidos**: 6 partidos de ejemplo en diferentes deportes
- **Rankings**: 7 jugadores en el ranking
- **Historial**: 5 partidos pasados

Para modificar los datos, edita directamente `src/mocks/data.ts`.

## 🎯 Funcionalidades Principales

### Dashboard
- Selector de deportes (tabs)
- Tarjeta de usuario con estadísticas
- Gestión de equipos (para deportes en equipo)
- Crear partido (modal con formulario)
- Buscar partidos (con animación de carga)
- Mis partidos (próximos)
- Partidos disponibles (con opción de unirse)

### Perfil
- Avatar y datos del usuario
- Selector de deporte para ver estadísticas
- Stats al estilo FIFA: Habilidad, Resistencia, Técnica, Trabajo en equipo
- Historial de partidos jugados

### Ranking
- Tabla con posiciones
- Filtros por deporte y universidad
- Destacado del usuario actual
- Medallas para top 3

### Historial
- Lista de partidos pasados
- Filtros por deporte y nivel
- Indicador visual de victoria/derrota/empate

## 🚧 Limitaciones (MVP)

- **Sin backend**: Todo en memoria + localStorage
- **Sin base de datos**: Los datos se resetean al recargar (excepto usuario)
- **Sin autenticación real**: Mock login
- **Sin búsqueda real**: Búsqueda simulada con timeout
- **Sin notificaciones push**: Solo toasts in-app
- **Sin mapa real**: Selector de ubicaciones predefinidas
- **Sin chat**: No hay comunicación entre usuarios
- **Sin pagos**: Costo de pista solo informativo

## 📝 Notas Importantes

- **Especificación**: Toda la lógica y diseño está basada en el documento `a.docx` (especificación autoritativa)
- **Diseño responsive**: Mobile-first con Tailwind
- **Sin imágenes externas**: Solo iconos SVG inline para ahorrar recursos
- **Optimizado para MVP**: Código funcional pero listo para escalar

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 📄 Licencia

Este es un proyecto MVP sin backend. Para uso educativo y demostrativo.

---

**Desarrollado siguiendo las especificaciones del documento `/mnt/data/a.docx`**
