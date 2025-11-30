# MATCHPOINT

Aplicación de matchmaking para deportes construida con Next.js, TypeScript y shadcn/ui.

## Características

- 🔐 Autenticación de usuarios
- 🗺️ Mapa interactivo con partidos cercanos (Leaflet)
- 📊 Ranking de jugadores por puntos
- ⚡ Partidos en tiempo real ("Ahora")
- ➕ Crear nuevos partidos
- 👤 Perfil de usuario
- ⚙️ Ajustes y configuración
- 🌓 Modo claro y oscuro
- 📱 Diseño responsive (móvil y desktop)
- 🎯 Tipos TypeScript para mejor desarrollo
- 🔔 Notificaciones toast
- ⚡ Hook personalizado de autenticación
- 🎨 Componentes UI reutilizables

## Pantallas

1. **Login** - Inicio de sesión
2. **Home** - Mapa de partidos cercanos y ranking
3. **Searching** - Pantalla de búsqueda (transición)
4. **Ahora** - Lista de partidos disponibles ahora
5. **Crear Partido** - Formulario para crear un nuevo partido
6. **Perfil** - Perfil del usuario
7. **Ajustes** - Configuración de la cuenta

## Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **next-themes** - Soporte para modo oscuro
- **Leaflet** - Mapas interactivos
- **react-leaflet** - Integración de Leaflet con React

## Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Datos de Prueba

La aplicación usa archivos JSON para simular una base de datos:

- `data/users.json` - Usuarios y credenciales
- `data/matches.json` - Partidos disponibles
- `data/posts.json` - Posts/publicaciones

### Credenciales de Prueba

Puedes iniciar sesión con cualquiera de estos usuarios:

- Email: `gabriel@example.com` / Password: `password123`
- Email: `nico@example.com` / Password: `password123`
- Email: `maria@example.com` / Password: `password123`
- Email: `carlos@example.com` / Password: `password123`
- Email: `laura@example.com` / Password: `password123`

## Estructura del Proyecto

```
MATCHPOINT/
├── app/                    # Páginas de Next.js
│   ├── home/              # Pantalla principal
│   ├── searching/         # Pantalla de búsqueda
│   ├── ahora/            # Partidos ahora
│   ├── create/           # Crear partido
│   ├── profile/          # Perfil de usuario
│   └── settings/         # Ajustes
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── screens/          # Componentes de pantallas
│   ├── map/              # Componentes de mapas
│   │   ├── match-map.tsx # Mapa con marcadores
│   │   └── match-card-bottom-sheet.tsx # Card deslizable
│   ├── navigation-bar.tsx # Barra de navegación
│   └── loading-spinner.tsx # Spinner de carga
├── hooks/                 # Hooks personalizados
│   └── use-auth.ts       # Hook de autenticación
├── types/                 # Tipos TypeScript
│   └── index.ts          # Definiciones de tipos
├── data/                 # Archivos JSON de datos
├── lib/                  # Utilidades
└── public/               # Archivos estáticos
```

## Próximos Pasos

- Integrar una base de datos real
- Añadir autenticación real con JWT
- Integrar un servicio de mapas (Google Maps, Mapbox)
- Añadir notificaciones push
- Implementar sistema de mensajería
- Añadir más deportes y categorías

## Licencia

MIT

