import React from 'react';
import { motion } from 'framer-motion';
import { History, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';
import { StorageService } from '../../services/storage';
import BlurText from '../BlurText';

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

      {/* Welcome Section */}
      <div className="text-center mb-12">
        <BlurText
          text="Discover your next favorite song"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl"
        />
      </div>

      <div className="space-y-12">
        {/* Recently Played Section */}
        {state.recentlyPlayed.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-glass-light/30 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-glow-blue to-glow-green shadow-lg">
                  <History className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Recently Played</h2>
                  <p className="text-gray-400 text-sm">Continue where you left off</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearRecentlyPlayed}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all border border-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear All</span>
              </motion.button>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-6 min-w-max pb-4">
                {state.recentlyPlayed.slice(0, 8).map((track, index) => (
                  <motion.div
                    key={`${track.id}-${track.playedAt}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TrackCard
                      track={track}
                      index={index}
                      showPlayedAt
                      playedAt={track.playedAt}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Language Suggestions Section */}
        {state.languageSuggestions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-glass-light/30 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-glow-green to-glow-blue shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Discover by Language</h2>
                <p className="text-gray-400 text-sm">Songs tailored to your preferences</p>
              </div>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-6 min-w-max pb-4">
                {state.languageSuggestions.slice(0, 8).map((track, index) => (
                  <motion.div
                    key={`${track.id}-suggestion-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
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
        )}

        {/* Empty State */}
        {state.recentlyPlayed.length === 0 && state.languageSuggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-glass-light/20 backdrop-blur-sm rounded-3xl border border-white/5"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-r from-glow-blue/20 to-glow-green/20 w-fit mx-auto mb-6">
              <History className="h-16 w-16 text-glow-blue mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Start Your Music Journey</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
              Play some songs to see your recently played tracks and personalized recommendations here
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
