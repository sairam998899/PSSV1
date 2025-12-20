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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-glass-light/20 backdrop-blur-sm rounded-3xl border border-white/5"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-neon-cyan/20 to-neon-green/20 w-fit mx-auto mb-6">
          <Search className="h-16 w-16 text-neon-cyan mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No Search Results</h3>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          Try searching for your favorite songs or artists to discover amazing music
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-glass-light/30 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-green shadow-lg">
            <Music className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Search Results</h2>
            <p className="text-gray-400 text-sm">{state.searchResults.length} amazing tracks found</p>
          </div>
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-6 min-w-max pb-4">
            {state.searchResults.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <TrackCard
                  track={track}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
