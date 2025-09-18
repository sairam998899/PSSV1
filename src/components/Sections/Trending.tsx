import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-gradient-to-r from-glow-green to-glow-blue">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          <p className="text-gray-400 text-sm">Top trending songs from YouTube</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.trending.map((track, index) => (
          <motion.div
            key={track.id}
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            {index < 3 && (
              <div className="absolute -top-2 -left-2 z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-glow-blue to-glow-green flex items-center justify-center text-black font-bold text-sm">
                  {index + 1}
                </div>
              </div>
            )}
            <TrackCard track={track} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
