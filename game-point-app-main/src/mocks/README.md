# Mock Data Documentation

This folder contains all the mock data used in the Match Point MVP.

## Files

- `data.ts` - Main mock data file containing users, matches, rankings, and history

## Data Structures

### Users
Mock users with profiles, stats, and match history. Default user is Carlos Martínez from U-tad.

### Matches
Pre-populated matches across all sports (football, basketball, tennis, padel) with different times, locations, and skill levels.

### Rankings
Leaderboard entries for each sport showing top players by points.

### History
Past match results for the logged-in user.

## Modifying Mock Data

To add more data:

1. Open `data.ts`
2. Add entries to the relevant array (mockUsers, mockMatches, mockRankings, mockHistory)
3. Follow the TypeScript types defined in `src/types/index.ts`

## Notes

- All data is stored in memory and resets on page refresh
- User data persists in localStorage when logged in
- IDs are unique strings (e.g., 'user-1', 'match-1')
