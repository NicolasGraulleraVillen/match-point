import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, mockMatches, mockRankings, mockHistory, mockTeams } from '@/mocks/data';
import { User, Match, RankingEntry, HistoryMatch, Sport, Team, Level } from '@/types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  availableMatches: Match[];
  myMatches: Match[];
  selectedSport: Sport;
  setSelectedSport: (sport: Sport) => void;
  rankings: RankingEntry[];
  history: HistoryMatch[];
  createMatch: (match: Omit<Match, 'id' | 'participants' | 'creatorId'>) => void;
  joinMatch: (matchId: string) => void;
  leaveMatch: (matchId: string) => void;
  searchMatches: (filters?: { minDate: string; sport: Sport | 'all'; level: Level | 'all' }) => Promise<void>;
  createTeam: (name: string, sport: Sport, members: string[]) => void;
  joinTeam: (code: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [availableMatches, setAvailableMatches] = useState<Match[]>([]);
  const [myMatches, setMyMatches] = useState<Match[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport>('football');
  const [rankings, setRankings] = useState<RankingEntry[]>(mockRankings);
  const [history, setHistory] = useState<HistoryMatch[]>(mockHistory);
  const [searchFilters, setSearchFilters] = useState<{ minDate: string; sport: Sport | 'all'; level: Level | 'all' } | null>(null);

  // Initialize user from localStorage or use mock
  useEffect(() => {
    const savedUser = localStorage.getItem('matchpoint_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('matchpoint_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('matchpoint_user');
    }
  }, [user]);

  // Filter matches by selected sport and search filters
  useEffect(() => {
    let filteredMatches = mockMatches.filter(m => m.sport === selectedSport);
    
    // Apply search filters if they exist
    if (searchFilters) {
      if (searchFilters.minDate) {
        filteredMatches = filteredMatches.filter(m => m.date >= searchFilters.minDate);
      }
      if (searchFilters.sport !== 'all') {
        filteredMatches = filteredMatches.filter(m => m.sport === searchFilters.sport);
      }
      if (searchFilters.level !== 'all') {
        filteredMatches = filteredMatches.filter(m => m.requiredLevel === searchFilters.level);
      }
    }
    
    const userMatchIds = user?.matches || [];
    setAvailableMatches(filteredMatches.filter(m => !userMatchIds.includes(m.id)));
    setMyMatches(filteredMatches.filter(m => userMatchIds.includes(m.id)));
  }, [selectedSport, user, searchFilters]);

  // Update rankings when user profile changes
  useEffect(() => {
    if (user) {
      setRankings(prev => {
        const userInRanking = prev.find(r => r.userId === user.id);
        if (userInRanking) {
          return prev.map(r => 
            r.userId === user.id 
              ? { ...r, name: user.name, university: user.university, sport: user.mainSport, points: user.points }
              : r
          );
        } else {
          // Add user to rankings if not present
          return [...prev, {
            position: prev.length + 1,
            userId: user.id,
            name: user.name,
            university: user.university,
            sport: user.mainSport,
            points: user.points,
            matchesPlayed: user.stats[user.mainSport].matches
          }];
        }
      });
    }
  }, [user]);

  const createMatch = (matchData: Omit<Match, 'id' | 'participants' | 'creatorId'>) => {
    if (!user) return;

    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
      participants: [user.id],
      creatorId: user.id,
    };

    setMyMatches(prev => [...prev, newMatch]);
    setUser(prev => prev ? { ...prev, matches: [...prev.matches, newMatch.id] } : null);
  };

  const joinMatch = (matchId: string) => {
    if (!user) return;

    const match = availableMatches.find(m => m.id === matchId);
    if (!match) return;

    setAvailableMatches(prev => prev.filter(m => m.id !== matchId));
    setMyMatches(prev => [...prev, { ...match, participants: [...match.participants, user.id] }]);
    setUser(prev => prev ? { ...prev, matches: [...prev.matches, matchId] } : null);
  };

  const leaveMatch = (matchId: string) => {
    if (!user) return;

    const match = myMatches.find(m => m.id === matchId);
    if (!match) return;

    setMyMatches(prev => prev.filter(m => m.id !== matchId));
    setAvailableMatches(prev => [...prev, match]);
    setUser(prev => prev ? { ...prev, matches: prev.matches.filter(id => id !== matchId) } : null);
  };

  const searchMatches = async (filters?: { minDate: string; sport: Sport | 'all'; level: Level | 'all' }) => {
    // Simulate search with loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (filters) {
      setSearchFilters(filters);
    }
  };

  const createTeam = (name: string, sport: Sport, members: string[]) => {
    if (!user) return;

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      sport,
      members: [user.id, ...members],
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    setUser(prev => prev ? { ...prev, team: newTeam } : null);
  };

  const joinTeam = (code: string) => {
    if (!user) return;
    
    const team = mockTeams.find(t => t.code.toUpperCase() === code.toUpperCase());
    if (team) {
      const updatedTeam: Team = {
        ...team,
        members: [...team.members, user.id]
      };
      setUser(prev => prev ? { ...prev, team: updatedTeam } : null);
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        availableMatches,
        myMatches,
        selectedSport,
        setSelectedSport,
        rankings,
        history,
        createMatch,
        joinMatch,
        leaveMatch,
        searchMatches,
        createTeam,
        joinTeam,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
