import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Crown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';
import { YouTubeService } from '../../services/youtube';

export function Trending() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending = await YouTubeService.getTrending();
        dispatch({ type: 'SET_TRENDING', payload: trending });
      } catch (error) {
        console.error('Failed to load trending:', error);
      }
    };

    if (state.trending.length === 0) {
      loadTrending();
    }
  }, [state.trending.length, dispatch]);

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
          <div className="p-3 rounded-2xl bg-gradient-to-r from-glow-green to-glow-blue shadow-lg">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            <p className="text-gray-400 text-sm">Top trending songs from YouTube</p>
          </div>
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-6 min-w-max pb-4">
            {state.trending.map((track, index) => (
              <motion.div
                key={track.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-glow-blue to-glow-green flex items-center justify-center text-black font-bold text-lg shadow-lg border-2 border-white/20">
                      {index === 0 ? <Crown className="h-5 w-5" /> : index + 1}
                    </div>
                  </div>
                )}
                <TrackCard track={track} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
