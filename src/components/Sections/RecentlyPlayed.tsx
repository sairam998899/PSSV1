import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, TrendingUp, Sparkles, Music, Play, Clock, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';
import { StorageService } from '../../services/storage';
import BlurText from '../BlurText';
import { AlbumView } from './AlbumView';

export function RecentlyPlayed() {
  const { state, dispatch } = useApp();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const clearRecentlyPlayed = () => {
    StorageService.setRecentlyPlayed([]);
    dispatch({ type: 'LOAD_STORAGE_DATA' });
  };

  const getTimeBasedIcon = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '🌙';
    if (hour < 12) return '☀️';
    if (hour < 17) return '🌤️';
    if (hour < 21) return '🌆';
    return '🌙';
  };

  if (state.recentlyPlayed.length === 0 && state.languageSuggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative min-h-[60vh] flex items-center justify-center"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-glow-blue/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-green/8 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-glow-blue/20 to-glow-green/20 backdrop-blur-xl border border-white/10 flex items-center justify-center"
          >
            <Music className="w-12 h-12 text-glow-blue" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-glow-blue to-glow-green bg-clip-text text-transparent"
          >
            {greeting}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Ready to discover your next favorite song? {getTimeBasedIcon()}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-glow-blue to-glow-green rounded-2xl text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Start Listening
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Explore Music
            </motion.button>
          </motion.div>
        </div>
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
          .glass-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
            backdrop-filter: blur(35px);
            border: 1px solid rgba(255,255,255,0.03);
          }
          .premium-shadow {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }
        `
      }} />

      {/* Enhanced Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-16"
      >
        {/* Floating background elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-glow-blue/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -top-5 -right-5 w-24 h-24 bg-glow-green/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-glow-blue/20 to-glow-green/20 backdrop-blur-xl border border-white/10"
          >
            <span className="text-2xl">{getTimeBasedIcon()}</span>
            <span className="text-lg font-medium text-white">{greeting}!</span>
          </motion.div>

          <BlurText
            text="Discover your next favorite song"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Your personalized music journey awaits. Explore, discover, and enjoy the perfect soundtrack for every moment.
          </motion.p>
        </div>
      </motion.div>

      <div className="space-y-16">
        {/* Recently Played Section - Premium Design */}
        <AnimatePresence>
          {state.recentlyPlayed.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass-card rounded-3xl p-8 md:p-10 premium-shadow relative overflow-hidden"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-glow-blue rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-glow-green rounded-full blur-3xl transform -translate-x-24 translate-y-24" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-5"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-glow-blue to-glow-green shadow-xl flex items-center justify-center">
                        <History className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Recently Played</h2>
                      <p className="text-gray-400 text-base flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Continue where you left off
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearRecentlyPlayed}
                    className="group flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-sm"
                  >
                    <Trash2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">Clear History</span>
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="overflow-x-auto hide-scrollbar"
                >
                  <div className="flex space-x-6 min-w-max pb-6">
                    {state.recentlyPlayed.slice(0, 10).map((track, index) => (
                      <motion.div
                        key={`${track.id}-${track.playedAt}`}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.1 * index,
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="transform transition-all duration-300"
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
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Album Section */}
        <AlbumView />

        {/* Language Suggestions Section - Premium Design */}
        <AnimatePresence>
          {state.languageSuggestions.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="glass-card rounded-3xl p-8 md:p-10 premium-shadow relative overflow-hidden"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-56 h-56 bg-glow-green rounded-full blur-3xl transform -translate-x-28 -translate-y-28" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-glow-blue rounded-full blur-3xl transform translate-x-36 translate-y-36" />
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-5 mb-8"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-glow-green to-glow-blue shadow-xl flex items-center justify-center">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Discover by Language</h2>
                    <p className="text-gray-400 text-base flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Curated for your taste
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="overflow-x-auto hide-scrollbar"
                >
                  <div className="flex space-x-6 min-w-max pb-6">
                    {state.languageSuggestions.slice(0, 10).map((track, index) => (
                      <motion.div
                        key={`${track.id}-suggestion-${index}`}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.1 * index,
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="transform transition-all duration-300"
                      >
                        <TrackCard
                          track={track}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
