import { Trophy } from 'lucide-react';
import { Sport } from '@/types';

// Simple SVG icons for sports
export const SportIcon = ({ sport, className = "h-6 w-6" }: { sport: Sport; className?: string }) => {
  switch (sport) {
    case 'football':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 2 L13.5 7 L19 7.5 L14.5 11 L16 16.5 L12 13.5 L8 16.5 L9.5 11 L5 7.5 L10.5 7 Z" 
                fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <path d="M12 2 L13.5 7 M19 7.5 L14.5 11 M16 16.5 L12 13.5 M8 16.5 L9.5 11 M5 7.5 L10.5 7" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'basketball':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 2 C14 8, 14 16, 12 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 2 C10 8, 10 16, 12 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M2 12 C8 10, 16 10, 22 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M2 12 C8 14, 16 14, 22 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'tennis':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M5 5 L11 11" stroke="currentColor" strokeWidth="1" />
          <path d="M5 11 L11 5" stroke="currentColor" strokeWidth="1" />
          <path d="M13 13 L19.5 19.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M13.5 13.5 L19 19" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="20.5" cy="20.5" r="2" fill="currentColor" />
          <circle cx="20.5" cy="20.5" r="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case 'padel':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" />
          <line x1="5" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="0.5" />
          <line x1="5" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="0.5" />
          <line x1="5" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="0.5" />
          <line x1="5" y1="15" x2="9" y2="15" stroke="currentColor" strokeWidth="0.5" />
          <path d="M15 3 L21 3 L21 17 L15 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7" cy="19.5" r="1.2" fill="currentColor" />
          <circle cx="18" cy="20.5" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return <Trophy className={className} />;
  }
};

export const getSportName = (sport: Sport): string => {
  const names: Record<Sport, string> = {
    football: 'Fútbol',
    basketball: 'Baloncesto',
    tennis: 'Tenis',
    padel: 'Pádel',
  };
  return names[sport];
};

export const getSportColor = (sport: Sport): string => {
  const colors: Record<Sport, string> = {
    football: 'text-primary',
    basketball: 'text-highlight',
    tennis: 'text-secondary',
    padel: 'text-accent',
  };
  return colors[sport];
};
