# Redesign Music Algorithm Task

## Current Status
- Analyzed current algorithm that uses undefined genre/theme fields
- Identified need to extract language and year from song metadata
- Plan approved by user to proceed without breaking existing components

## Tasks
- [ ] Update Track interface to include 'year' field
- [ ] Create utility function to extract language and year from song title/publishedAt
- [ ] Modify MusicPlayer next song logic to use language/year matching
- [ ] Update playTrack function to populate metadata
- [ ] Test the new algorithm with various songs

## Files to Modify
- src/types/index.ts - Add year field to Track
- src/lib/utils.ts - Add extraction utility
- src/components/Player/MusicPlayer.tsx - Update next song algorithm
- src/contexts/AppContext.tsx - Update playTrack to populate metadata
