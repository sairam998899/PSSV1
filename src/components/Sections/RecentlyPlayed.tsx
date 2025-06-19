import React from 'react';
import { motion } from 'framer-motion';
import { History, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';
import { StorageService } from '../../services/storage';

export function RecentlyPlayed() {
  const { state, dispatch } = useApp();

  const clearRecentlyPlayed = () => {
    StorageService.setRecentlyPlayed([]);
    dispatch({ type: 'LOAD_STORAGE_DATA' });
  };

  if (state.recentlyPlayed.length === 0 && state.languageSuggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <History className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl text-gray-400 mb-2">No Recently Played Tracks or Suggestions</h3>
        <p className="text-gray-500">Start listening to see your recent tracks or suggestions here</p>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {state.recentlyPlayed.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-glow-blue to-glow-green">
                  <History className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Recently Played</h2>
                  <p className="text-gray-400 text-sm">Your last 10 tracks</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearRecentlyPlayed}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {state.recentlyPlayed.map((track, index) => (
                <TrackCard
                  key={`${track.id}-${track.playedAt}`}
                  track={track}
                  index={index}
                  showPlayedAt
                  playedAt={track.playedAt}
                />
              ))}
            </div>
          </section>
        )}

        {state.languageSuggestions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Suggested Songs by Language</h2>
            <div className="grid grid-cols-1 gap-4">
              {state.languageSuggestions.map((track, index) => (
                <TrackCard
                  key={`${track.id}-suggestion-${index}`}
                  track={track}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.section>
  );
}