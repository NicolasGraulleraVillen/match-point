export type Sport = 'football' | 'basketball' | 'tennis' | 'padel';
export type Level = 'novato' | 'intermedio' | 'pro';
export type University = 'U-tad' | 'Complutense' | 'Politécnica';

export interface User {
  id: string;
  name: string;
  email: string;
  university: University;
  avatar?: string;
  mainSport: Sport;
  levels: Record<Sport, Level>;
  matches: string[];
  team?: Team;
  stats: Record<Sport, PlayerStats>;
  points: number;
}

export interface Team {
  id: string;
  name: string;
  sport: Sport;
  members: string[];
  code: string;
  createdAt: string;
  avatar?: string;
}

export interface Match {
  id: string;
  sport: Sport;
  date: string;
  time: string;
  location: string;
  requiredLevel: Level;
  maxParticipants: number;
  participants: string[];
  creatorId: string;
  cost?: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  creatorComments?: string;
}

export interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  university: University;
  sport: Sport;
  points: number;
  matchesPlayed: number;
  avatar?: string;
}

export interface HistoryMatch {
  id: string;
  sport: Sport;
  date: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  level: Level;
}

export interface PlayerStats {
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  skillRating: number;
  stamina: number;
  technique: number;
  teamwork: number;
}
