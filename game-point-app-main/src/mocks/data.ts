import { User, Match, RankingEntry, HistoryMatch, Team } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Carlos Martínez',
    email: 'carlos@utad.com',
    university: 'U-tad',
    mainSport: 'football',
    levels: {
      football: 'pro',
      basketball: 'intermedio',
      tennis: 'novato',
      padel: 'intermedio',
    },
    matches: [],
    points: 1250,
    stats: {
      football: { matches: 45, wins: 32, losses: 13, winRate: 71, skillRating: 88, stamina: 85, technique: 90, teamwork: 92 },
      basketball: { matches: 20, wins: 12, losses: 8, winRate: 60, skillRating: 75, stamina: 80, technique: 72, teamwork: 78 },
      tennis: { matches: 8, wins: 3, losses: 5, winRate: 38, skillRating: 65, stamina: 70, technique: 68, teamwork: 60 },
      padel: { matches: 15, wins: 9, losses: 6, winRate: 60, skillRating: 72, stamina: 75, technique: 70, teamwork: 80 },
    },
  },
  {
    id: 'user-jaime',
    name: 'Jaime',
    email: 'jaime@example.com',
    university: 'Complutense',
    mainSport: 'basketball',
    levels: {
      football: 'intermedio',
      basketball: 'pro',
      tennis: 'novato',
      padel: 'intermedio',
    },
    matches: [],
    points: 1450,
    stats: {
      football: { matches: 30, wins: 18, losses: 12, winRate: 60, skillRating: 75, stamina: 78, technique: 73, teamwork: 80 },
      basketball: { matches: 50, wins: 38, losses: 12, winRate: 76, skillRating: 92, stamina: 90, technique: 88, teamwork: 95 },
      tennis: { matches: 10, wins: 4, losses: 6, winRate: 40, skillRating: 62, stamina: 65, technique: 60, teamwork: 58 },
      padel: { matches: 20, wins: 12, losses: 8, winRate: 60, skillRating: 74, stamina: 72, technique: 75, teamwork: 78 },
    },
  },
];

// Mock teams for join team functionality
export const mockTeams: Team[] = [
  { id: 'team-1', name: 'Los Tigres', sport: 'football', members: ['user-101', 'user-102', 'user-103', 'user-104', 'user-105', 'user-106'], code: 'TIG123', createdAt: '2025-11-01', avatar: undefined },
  { id: 'team-2', name: 'Dream Team', sport: 'basketball', members: ['user-206', 'user-207', 'user-208', 'user-209'], code: 'DRM456', createdAt: '2025-11-05', avatar: undefined },
  { id: 'team-3', name: 'Thunder FC', sport: 'football', members: ['user-201', 'user-202', 'user-203', 'user-204', 'user-205', 'user-206', 'user-207'], code: 'THU789', createdAt: '2025-11-10', avatar: undefined },
  { id: 'team-4', name: 'Phoenix Rising', sport: 'basketball', members: ['user-106', 'user-107', 'user-108', 'user-109', 'user-110'], code: 'PHX321', createdAt: '2025-11-15', avatar: undefined },
  { id: 'team-5', name: 'Elite Squad', sport: 'football', members: ['user-301', 'user-302', 'user-303', 'user-304', 'user-305', 'user-306', 'user-307'], code: 'ELT654', createdAt: '2025-11-20', avatar: undefined },
  { id: 'team-6', name: 'All Stars', sport: 'basketball', members: ['user-306', 'user-307', 'user-308', 'user-309'], code: 'AST987', createdAt: '2025-11-22', avatar: undefined },
  { id: 'team-7', name: 'Victory United', sport: 'football', members: ['user-101', 'user-102', 'user-201', 'user-202', 'user-301', 'user-302', 'user-303'], code: 'VIC111', createdAt: '2025-11-25', avatar: undefined },
];

// Expanded mock matches: 9 matches per sport (4 sports), 3 per difficulty level
export const mockMatches: Match[] = [
  // Football - Novato
  { id: 'match-f-n1', sport: 'football', date: '2025-12-02', time: '18:00', location: 'Polideportivo U-tad', requiredLevel: 'novato', maxParticipants: 10, participants: ['user-2', 'user-3'], creatorId: 'user-2', cost: 5, status: 'upcoming', creatorComments: 'Primera vez organizando, todos bienvenidos!' },
  { id: 'match-f-n2', sport: 'football', date: '2025-12-05', time: '17:30', location: 'Campo Municipal Norte', requiredLevel: 'novato', maxParticipants: 12, participants: ['user-11'], creatorId: 'user-11', cost: 4, status: 'upcoming', creatorComments: 'Ambiente relajado, para pasarlo bien' },
  { id: 'match-f-n3', sport: 'football', date: '2025-12-08', time: '19:00', location: 'Instalaciones Complutense', requiredLevel: 'novato', maxParticipants: 10, participants: ['user-15', 'user-16'], creatorId: 'user-15', cost: 3, status: 'upcoming', creatorComments: 'Traed agua, hace calor' },
  
  // Football - Intermedio
  { id: 'match-f-i1', sport: 'football', date: '2025-12-03', time: '18:30', location: 'Polideportivo Central', requiredLevel: 'intermedio', maxParticipants: 14, participants: ['user-5', 'user-6'], creatorId: 'user-5', cost: 6, status: 'upcoming', creatorComments: 'Buscamos nivel medio-alto' },
  { id: 'match-f-i2', sport: 'football', date: '2025-12-06', time: '20:00', location: 'Campo Politécnica', requiredLevel: 'intermedio', maxParticipants: 10, participants: ['user-17', 'user-18', 'user-19'], creatorId: 'user-17', cost: 5, status: 'upcoming', creatorComments: 'Necesitamos portero' },
  { id: 'match-f-i3', sport: 'football', date: '2025-12-09', time: '17:00', location: 'Centro Deportivo U-tad', requiredLevel: 'intermedio', maxParticipants: 12, participants: ['user-20'], creatorId: 'user-20', cost: 7, status: 'upcoming', creatorComments: 'Campo de césped artificial nuevo' },
  
  // Football - Pro
  { id: 'match-f-p1', sport: 'football', date: '2025-12-04', time: '19:30', location: 'Campo Municipal Sur', requiredLevel: 'pro', maxParticipants: 14, participants: ['user-4'], creatorId: 'user-4', cost: 8, status: 'upcoming', creatorComments: 'Solo jugadores experimentados' },
  { id: 'match-f-p2', sport: 'football', date: '2025-12-07', time: '18:00', location: 'Complejo Deportivo Elite', requiredLevel: 'pro', maxParticipants: 10, participants: ['user-21', 'user-22'], creatorId: 'user-21', cost: 10, status: 'upcoming', creatorComments: 'Partidazo competitivo' },
  { id: 'match-f-p3', sport: 'football', date: '2025-12-10', time: '20:30', location: 'Estadio Universitario', requiredLevel: 'pro', maxParticipants: 14, participants: ['user-23', 'user-24', 'user-25'], creatorId: 'user-23', cost: 9, status: 'upcoming', creatorComments: 'Liga universitaria clasificatoria' },

  // Basketball - Novato
  { id: 'match-b-n1', sport: 'basketball', date: '2025-12-02', time: '17:00', location: 'Pabellón U-tad', requiredLevel: 'novato', maxParticipants: 8, participants: ['user-8'], creatorId: 'user-8', cost: 3, status: 'upcoming', creatorComments: 'Aprendiendo a jugar, sin presión' },
  { id: 'match-b-n2', sport: 'basketball', date: '2025-12-05', time: '18:30', location: 'Polideportivo Municipal', requiredLevel: 'novato', maxParticipants: 10, participants: ['user-26', 'user-27'], creatorId: 'user-26', cost: 4, status: 'upcoming', creatorComments: 'Principiantes bienvenidos' },
  { id: 'match-b-n3', sport: 'basketball', date: '2025-12-08', time: '16:00', location: 'Gimnasio Complutense', requiredLevel: 'novato', maxParticipants: 8, participants: ['user-28'], creatorId: 'user-28', cost: 2, status: 'upcoming', creatorComments: 'Juego tranquilo' },

  // Basketball - Intermedio
  { id: 'match-b-i1', sport: 'basketball', date: '2025-12-03', time: '19:00', location: 'Pabellón Complutense', requiredLevel: 'intermedio', maxParticipants: 10, participants: ['user-5', 'user-6', 'user-7'], creatorId: 'user-5', cost: 5, status: 'upcoming', creatorComments: 'Buen nivel técnico requerido' },
  { id: 'match-b-i2', sport: 'basketball', date: '2025-12-06', time: '20:30', location: 'Centro Deportivo', requiredLevel: 'intermedio', maxParticipants: 8, participants: ['user-29', 'user-30'], creatorId: 'user-29', cost: 6, status: 'upcoming', creatorComments: 'Partido competitivo pero amistoso' },
  { id: 'match-b-i3', sport: 'basketball', date: '2025-12-09', time: '18:00', location: 'Polideportivo Politécnica', requiredLevel: 'intermedio', maxParticipants: 10, participants: ['user-31'], creatorId: 'user-31', cost: 5, status: 'upcoming', creatorComments: 'Traed vuestro balón' },

  // Basketball - Pro
  { id: 'match-b-p1', sport: 'basketball', date: '2025-12-04', time: '21:00', location: 'Arena Universitaria', requiredLevel: 'pro', maxParticipants: 10, participants: ['user-32', 'user-33'], creatorId: 'user-32', cost: 8, status: 'upcoming', creatorComments: 'Alto nivel competitivo' },
  { id: 'match-b-p2', sport: 'basketball', date: '2025-12-07', time: '19:30', location: 'Pabellón Elite', requiredLevel: 'pro', maxParticipants: 8, participants: ['user-34'], creatorId: 'user-34', cost: 10, status: 'upcoming', creatorComments: 'Ex-jugadores de liga' },
  { id: 'match-b-p3', sport: 'basketball', date: '2025-12-10', time: '20:00', location: 'Centro de Alto Rendimiento', requiredLevel: 'pro', maxParticipants: 10, participants: ['user-35', 'user-36', 'user-37'], creatorId: 'user-35', cost: 9, status: 'upcoming', creatorComments: 'Preparación torneo' },

  // Tennis - Novato
  { id: 'match-t-n1', sport: 'tennis', date: '2025-12-02', time: '16:00', location: 'Club de Tenis Municipal', requiredLevel: 'novato', maxParticipants: 4, participants: ['user-8'], creatorId: 'user-8', cost: 12, status: 'upcoming', creatorComments: 'Dobles amistosos' },
  { id: 'match-t-n2', sport: 'tennis', date: '2025-12-05', time: '17:30', location: 'Pistas U-tad', requiredLevel: 'novato', maxParticipants: 2, participants: ['user-38'], creatorId: 'user-38', cost: 8, status: 'upcoming', creatorComments: 'Busco compañero de práctica' },
  { id: 'match-t-n3', sport: 'tennis', date: '2025-12-08', time: '15:00', location: 'Complejo Tenis Norte', requiredLevel: 'novato', maxParticipants: 4, participants: ['user-39', 'user-40'], creatorId: 'user-39', cost: 10, status: 'upcoming', creatorComments: 'Iniciación, traed raqueta' },

  // Tennis - Intermedio
  { id: 'match-t-i1', sport: 'tennis', date: '2025-12-03', time: '18:00', location: 'Club Tenis Complutense', requiredLevel: 'intermedio', maxParticipants: 2, participants: ['user-41'], creatorId: 'user-41', cost: 15, status: 'upcoming', creatorComments: 'Nivel medio sólido' },
  { id: 'match-t-i2', sport: 'tennis', date: '2025-12-06', time: '19:30', location: 'Pistas Deportivas Central', requiredLevel: 'intermedio', maxParticipants: 4, participants: ['user-42', 'user-43'], creatorId: 'user-42', cost: 14, status: 'upcoming', creatorComments: 'Dobles, buen nivel' },
  { id: 'match-t-i3', sport: 'tennis', date: '2025-12-09', time: '17:00', location: 'Centro Tenis Politécnica', requiredLevel: 'intermedio', maxParticipants: 2, participants: ['user-44'], creatorId: 'user-44', cost: 13, status: 'upcoming', creatorComments: 'Singles competitivo' },

  // Tennis - Pro
  { id: 'match-t-p1', sport: 'tennis', date: '2025-12-04', time: '20:00', location: 'Club Premium', requiredLevel: 'pro', maxParticipants: 2, participants: ['user-45'], creatorId: 'user-45', cost: 20, status: 'upcoming', creatorComments: 'Alto nivel, tierra batida' },
  { id: 'match-t-p2', sport: 'tennis', date: '2025-12-07', time: '18:30', location: 'Academia Elite', requiredLevel: 'pro', maxParticipants: 4, participants: ['user-46', 'user-47'], creatorId: 'user-46', cost: 22, status: 'upcoming', creatorComments: 'Jugadores avanzados' },
  { id: 'match-t-p3', sport: 'tennis', date: '2025-12-10', time: '19:00', location: 'Centro de Alto Rendimiento', requiredLevel: 'pro', maxParticipants: 2, participants: ['user-48'], creatorId: 'user-48', cost: 25, status: 'upcoming', creatorComments: 'Preparación torneo ITF' },

  // Padel - Novato
  { id: 'match-p-n1', sport: 'padel', date: '2025-12-02', time: '19:00', location: 'Pistas Padel U-tad', requiredLevel: 'novato', maxParticipants: 4, participants: ['user-49'], creatorId: 'user-49', cost: 8, status: 'upcoming', creatorComments: 'Primer partido, venid!' },
  { id: 'match-p-n2', sport: 'padel', date: '2025-12-05', time: '20:30', location: 'Club Padel Municipal', requiredLevel: 'novato', maxParticipants: 4, participants: ['user-50', 'user-51'], creatorId: 'user-50', cost: 10, status: 'upcoming', creatorComments: 'Principiantes, ambiente relajado' },
  { id: 'match-p-n3', sport: 'padel', date: '2025-12-08', time: '18:30', location: 'Centro Padel Norte', requiredLevel: 'novato', maxParticipants: 4, participants: ['user-52'], creatorId: 'user-52', cost: 9, status: 'upcoming', creatorComments: 'Aprendiendo técnica' },

  // Padel - Intermedio
  { id: 'match-p-i1', sport: 'padel', date: '2025-12-03', time: '20:00', location: 'Centro Deportivo U-tad', requiredLevel: 'intermedio', maxParticipants: 4, participants: ['user-9', 'user-10'], creatorId: 'user-9', cost: 15, status: 'upcoming', creatorComments: 'Nivel medio-alto' },
  { id: 'match-p-i2', sport: 'padel', date: '2025-12-06', time: '21:00', location: 'Club Padel Complutense', requiredLevel: 'intermedio', maxParticipants: 4, participants: ['user-53', 'user-54'], creatorId: 'user-53', cost: 16, status: 'upcoming', creatorComments: 'Buen ritmo de juego' },
  { id: 'match-p-i3', sport: 'padel', date: '2025-12-09', time: '19:30', location: 'Instalaciones Politécnica', requiredLevel: 'intermedio', maxParticipants: 4, participants: ['user-55'], creatorId: 'user-55', cost: 14, status: 'upcoming', creatorComments: 'Pista cubierta' },

  // Padel - Pro
  { id: 'match-p-p1', sport: 'padel', date: '2025-12-04', time: '21:30', location: 'Club Premium Padel', requiredLevel: 'pro', maxParticipants: 4, participants: ['user-56', 'user-57'], creatorId: 'user-56', cost: 20, status: 'upcoming', creatorComments: 'Alto nivel competitivo' },
  { id: 'match-p-p2', sport: 'padel', date: '2025-12-07', time: '20:00', location: 'Centro Elite', requiredLevel: 'pro', maxParticipants: 4, participants: ['user-58'], creatorId: 'user-58', cost: 22, status: 'upcoming', creatorComments: 'Jugadores avanzados únicamente' },
  { id: 'match-p-p3', sport: 'padel', date: '2025-12-10', time: '21:00', location: 'Academia Pro', requiredLevel: 'pro', maxParticipants: 4, participants: ['user-59', 'user-60'], creatorId: 'user-59', cost: 25, status: 'upcoming', creatorComments: 'Preparación circuito nacional' },
];

// Expanded mock rankings: 20 users per university (3 universities) = 60 users total
// 5 users per sport within each university
export const mockRankings: RankingEntry[] = [
  // U-tad - Football (5 users)
  { position: 1, userId: 'user-101', name: 'Ana García', university: 'U-tad', sport: 'football', points: 1520, matchesPlayed: 52 },
  { position: 4, userId: 'user-102', name: 'Miguel Torres', university: 'U-tad', sport: 'football', points: 1380, matchesPlayed: 48 },
  { position: 8, userId: 'user-103', name: 'Laura Sánchez', university: 'U-tad', sport: 'football', points: 1180, matchesPlayed: 42 },
  { position: 12, userId: 'user-104', name: 'Pablo Ruiz', university: 'U-tad', sport: 'football', points: 1050, matchesPlayed: 38 },
  { position: 17, userId: 'user-105', name: 'Elena Martín', university: 'U-tad', sport: 'football', points: 920, matchesPlayed: 35 },
  
  // U-tad - Basketball (5 users)
  { position: 2, userId: 'user-106', name: 'Carlos López', university: 'U-tad', sport: 'basketball', points: 1450, matchesPlayed: 50 },
  { position: 6, userId: 'user-107', name: 'Sara Díaz', university: 'U-tad', sport: 'basketball', points: 1280, matchesPlayed: 44 },
  { position: 11, userId: 'user-108', name: 'David González', university: 'U-tad', sport: 'basketball', points: 1120, matchesPlayed: 40 },
  { position: 15, userId: 'user-109', name: 'María Fernández', university: 'U-tad', sport: 'basketball', points: 980, matchesPlayed: 36 },
  { position: 20, userId: 'user-110', name: 'Javier Pérez', university: 'U-tad', sport: 'basketball', points: 850, matchesPlayed: 32 },
  
  // U-tad - Tennis (5 users)
  { position: 3, userId: 'user-111', name: 'Lucía Romero', university: 'U-tad', sport: 'tennis', points: 1420, matchesPlayed: 46 },
  { position: 9, userId: 'user-112', name: 'Alberto Navarro', university: 'U-tad', sport: 'tennis', points: 1150, matchesPlayed: 41 },
  { position: 14, userId: 'user-113', name: 'Cristina Moreno', university: 'U-tad', sport: 'tennis', points: 1010, matchesPlayed: 37 },
  { position: 18, userId: 'user-114', name: 'Roberto Vega', university: 'U-tad', sport: 'tennis', points: 890, matchesPlayed: 33 },
  { position: 23, userId: 'user-115', name: 'Patricia Ortiz', university: 'U-tad', sport: 'tennis', points: 780, matchesPlayed: 29 },
  
  // U-tad - Padel (5 users)
  { position: 5, userId: 'user-116', name: 'Fernando Castro', university: 'U-tad', sport: 'padel', points: 1350, matchesPlayed: 47 },
  { position: 10, userId: 'user-117', name: 'Isabel Ramos', university: 'U-tad', sport: 'padel', points: 1140, matchesPlayed: 39 },
  { position: 16, userId: 'user-118', name: 'Andrés Jiménez', university: 'U-tad', sport: 'padel', points: 950, matchesPlayed: 34 },
  { position: 21, userId: 'user-119', name: 'Carmen Silva', university: 'U-tad', sport: 'padel', points: 820, matchesPlayed: 30 },
  { position: 26, userId: 'user-120', name: 'Luis Herrera', university: 'U-tad', sport: 'padel', points: 720, matchesPlayed: 26 },

  // Complutense - Football (5 users)
  { position: 2, userId: 'user-201', name: 'Laura Fernández', university: 'Complutense', sport: 'football', points: 1480, matchesPlayed: 51 },
  { position: 7, userId: 'user-202', name: 'Jorge Martínez', university: 'Complutense', sport: 'football', points: 1220, matchesPlayed: 43 },
  { position: 13, userId: 'user-203', name: 'Natalia Cruz', university: 'Complutense', sport: 'football', points: 1030, matchesPlayed: 39 },
  { position: 19, userId: 'user-204', name: 'Sergio Vargas', university: 'Complutense', sport: 'football', points: 870, matchesPlayed: 34 },
  { position: 24, userId: 'user-205', name: 'Raquel Medina', university: 'Complutense', sport: 'football', points: 760, matchesPlayed: 28 },
  
  // Complutense - Basketball (5 users)
  { position: 1, userId: 'user-206', name: 'David López', university: 'Complutense', sport: 'basketball', points: 1550, matchesPlayed: 54 },
  { position: 5, userId: 'user-207', name: 'Victoria Soto', university: 'Complutense', sport: 'basketball', points: 1320, matchesPlayed: 45 },
  { position: 10, userId: 'user-208', name: 'Marcos Gil', university: 'Complutense', sport: 'basketball', points: 1130, matchesPlayed: 38 },
  { position: 16, userId: 'user-209', name: 'Andrea Iglesias', university: 'Complutense', sport: 'basketball', points: 960, matchesPlayed: 35 },
  { position: 22, userId: 'user-210', name: 'Óscar Domínguez', university: 'Complutense', sport: 'basketball', points: 810, matchesPlayed: 31 },
  
  // Complutense - Tennis (5 users)
  { position: 4, userId: 'user-211', name: 'Claudia Blanco', university: 'Complutense', sport: 'tennis', points: 1390, matchesPlayed: 49 },
  { position: 8, userId: 'user-212', name: 'Iván Molina', university: 'Complutense', sport: 'tennis', points: 1190, matchesPlayed: 40 },
  { position: 12, userId: 'user-213', name: 'Marta Campos', university: 'Complutense', sport: 'tennis', points: 1060, matchesPlayed: 36 },
  { position: 17, userId: 'user-214', name: 'Tomás Núñez', university: 'Complutense', sport: 'tennis', points: 930, matchesPlayed: 32 },
  { position: 25, userId: 'user-215', name: 'Beatriz Prieto', university: 'Complutense', sport: 'tennis', points: 750, matchesPlayed: 27 },
  
  // Complutense - Padel (5 users)
  { position: 3, userId: 'user-216', name: 'Raúl Gutiérrez', university: 'Complutense', sport: 'padel', points: 1440, matchesPlayed: 48 },
  { position: 7, userId: 'user-217', name: 'Silvia Reyes', university: 'Complutense', sport: 'padel', points: 1240, matchesPlayed: 42 },
  { position: 11, userId: 'user-218', name: 'Héctor Fuentes', university: 'Complutense', sport: 'padel', points: 1100, matchesPlayed: 37 },
  { position: 15, userId: 'user-219', name: 'Nuria Peña', university: 'Complutense', sport: 'padel', points: 970, matchesPlayed: 33 },
  { position: 20, userId: 'user-220', name: 'Daniel Aguilar', university: 'Complutense', sport: 'padel', points: 840, matchesPlayed: 29 },

  // Politécnica - Football (5 users)
  { position: 3, userId: 'user-301', name: 'Miguel Ángel Ruiz', university: 'Politécnica', sport: 'football', points: 1410, matchesPlayed: 50 },
  { position: 6, userId: 'user-302', name: 'Alicia Morales', university: 'Politécnica', sport: 'football', points: 1270, matchesPlayed: 44 },
  { position: 11, userId: 'user-303', name: 'Francisco Vidal', university: 'Politécnica', sport: 'football', points: 1110, matchesPlayed: 40 },
  { position: 15, userId: 'user-304', name: 'Irene Delgado', university: 'Politécnica', sport: 'football', points: 990, matchesPlayed: 36 },
  { position: 22, userId: 'user-305', name: 'Antonio Parra', university: 'Politécnica', sport: 'football', points: 800, matchesPlayed: 30 },
  
  // Politécnica - Basketball (5 users)
  { position: 4, userId: 'user-306', name: 'Elena Torres', university: 'Politécnica', sport: 'basketball', points: 1400, matchesPlayed: 46 },
  { position: 9, userId: 'user-307', name: 'Ricardo León', university: 'Politécnica', sport: 'basketball', points: 1160, matchesPlayed: 41 },
  { position: 13, userId: 'user-308', name: 'Sofía Ramírez', university: 'Politécnica', sport: 'basketball', points: 1040, matchesPlayed: 37 },
  { position: 18, userId: 'user-309', name: 'Manuel Cortés', university: 'Politécnica', sport: 'basketball', points: 910, matchesPlayed: 33 },
  { position: 23, userId: 'user-310', name: 'Verónica Santos', university: 'Politécnica', sport: 'basketball', points: 790, matchesPlayed: 28 },
  
  // Politécnica - Tennis (5 users)
  { position: 6, userId: 'user-311', name: 'Gabriel Méndez', university: 'Politécnica', sport: 'tennis', points: 1300, matchesPlayed: 45 },
  { position: 10, userId: 'user-312', name: 'Rosa Suárez', university: 'Politécnica', sport: 'tennis', points: 1135, matchesPlayed: 39 },
  { position: 15, userId: 'user-313', name: 'Emilio Rojas', university: 'Politécnica', sport: 'tennis', points: 1000, matchesPlayed: 35 },
  { position: 19, userId: 'user-314', name: 'Lorena Cabrera', university: 'Politécnica', sport: 'tennis', points: 880, matchesPlayed: 31 },
  { position: 27, userId: 'user-315', name: 'Adrián Pascual', university: 'Politécnica', sport: 'tennis', points: 700, matchesPlayed: 25 },
  
  // Politécnica - Padel (5 users)
  { position: 9, userId: 'user-316', name: 'Javier Moreno', university: 'Politécnica', sport: 'padel', points: 1170, matchesPlayed: 43 },
  { position: 12, userId: 'user-317', name: 'Paula Lozano', university: 'Politécnica', sport: 'padel', points: 1080, matchesPlayed: 38 },
  { position: 14, userId: 'user-318', name: 'Diego Serrano', university: 'Politécnica', sport: 'padel', points: 1020, matchesPlayed: 34 },
  { position: 19, userId: 'user-319', name: 'Carolina Muñoz', university: 'Politécnica', sport: 'padel', points: 860, matchesPlayed: 30 },
  { position: 25, userId: 'user-320', name: 'Esteban Flores', university: 'Politécnica', sport: 'padel', points: 730, matchesPlayed: 26 },
];

// Expanded mock history: 24 matches (6 per sport, 2 per difficulty level)
export const mockHistory: HistoryMatch[] = [
  // Football history (6 matches)
  { id: 'history-f-1', sport: 'football', date: '2025-11-25', opponent: 'Laura Fernández', result: 'win', score: '6-4', level: 'pro' },
  { id: 'history-f-2', sport: 'football', date: '2025-11-20', opponent: 'Miguel Ángel Ruiz', result: 'loss', score: '3-5', level: 'pro' },
  { id: 'history-f-3', sport: 'football', date: '2025-11-15', opponent: 'Ana García', result: 'win', score: '7-5', level: 'intermedio' },
  { id: 'history-f-4', sport: 'football', date: '2025-11-10', opponent: 'Jorge Martínez', result: 'draw', score: '4-4', level: 'intermedio' },
  { id: 'history-f-5', sport: 'football', date: '2025-11-05', opponent: 'Pablo Ruiz', result: 'win', score: '5-2', level: 'novato' },
  { id: 'history-f-6', sport: 'football', date: '2025-11-01', opponent: 'Francisco Vidal', result: 'loss', score: '2-3', level: 'novato' },

  // Basketball history (6 matches)
  { id: 'history-b-1', sport: 'basketball', date: '2025-11-24', opponent: 'David López', result: 'win', score: '85-78', level: 'pro' },
  { id: 'history-b-2', sport: 'basketball', date: '2025-11-19', opponent: 'Elena Torres', result: 'loss', score: '72-88', level: 'pro' },
  { id: 'history-b-3', sport: 'basketball', date: '2025-11-14', opponent: 'Carlos López', result: 'win', score: '90-82', level: 'intermedio' },
  { id: 'history-b-4', sport: 'basketball', date: '2025-11-09', opponent: 'Victoria Soto', result: 'draw', score: '75-75', level: 'intermedio' },
  { id: 'history-b-5', sport: 'basketball', date: '2025-11-04', opponent: 'Sara Díaz', result: 'win', score: '68-60', level: 'novato' },
  { id: 'history-b-6', sport: 'basketball', date: '2025-10-30', opponent: 'Ricardo León', result: 'loss', score: '55-62', level: 'novato' },

  // Tennis history (6 matches)
  { id: 'history-t-1', sport: 'tennis', date: '2025-11-23', opponent: 'Claudia Blanco', result: 'win', score: '6-4, 7-5', level: 'pro' },
  { id: 'history-t-2', sport: 'tennis', date: '2025-11-18', opponent: 'Gabriel Méndez', result: 'loss', score: '4-6, 3-6', level: 'pro' },
  { id: 'history-t-3', sport: 'tennis', date: '2025-11-13', opponent: 'Lucía Romero', result: 'win', score: '6-3, 6-4', level: 'intermedio' },
  { id: 'history-t-4', sport: 'tennis', date: '2025-11-08', opponent: 'Iván Molina', result: 'draw', score: '6-6', level: 'intermedio' },
  { id: 'history-t-5', sport: 'tennis', date: '2025-11-03', opponent: 'Alberto Navarro', result: 'win', score: '6-2, 6-1', level: 'novato' },
  { id: 'history-t-6', sport: 'tennis', date: '2025-10-29', opponent: 'Rosa Suárez', result: 'loss', score: '3-6, 4-6', level: 'novato' },

  // Padel history (6 matches)
  { id: 'history-p-1', sport: 'padel', date: '2025-11-22', opponent: 'Raúl Gutiérrez', result: 'win', score: '6-3, 6-4', level: 'pro' },
  { id: 'history-p-2', sport: 'padel', date: '2025-11-17', opponent: 'Fernando Castro', result: 'loss', score: '4-6, 5-7', level: 'pro' },
  { id: 'history-p-3', sport: 'padel', date: '2025-11-12', opponent: 'Silvia Reyes', result: 'win', score: '6-2, 6-3', level: 'intermedio' },
  { id: 'history-p-4', sport: 'padel', date: '2025-11-07', opponent: 'Isabel Ramos', result: 'draw', score: '6-6', level: 'intermedio' },
  { id: 'history-p-5', sport: 'padel', date: '2025-11-02', opponent: 'Héctor Fuentes', result: 'win', score: '7-5, 6-4', level: 'novato' },
  { id: 'history-p-6', sport: 'padel', date: '2025-10-28', opponent: 'Paula Lozano', result: 'loss', score: '3-6, 4-6', level: 'novato' },
];
