import React from 'react';
import { motion } from 'framer-motion';
import { Search, Music } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';

export function SearchResults() {
  const { state } = useApp();

  if (state.searchResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl text-gray-400 mb-2">No Search Results</h3>
        <p className="text-gray-500">Try searching for your favorite songs or artists</p>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-green">
          <Music className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Search Results</h2>
          <p className="text-gray-400 text-sm">{state.searchResults.length} tracks found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.searchResults.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}