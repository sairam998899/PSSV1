import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';

export default function LikedSongs() {
  const { state, playTrack, toggleLikeSong } = useApp();

  console.log('LikedSongs component - likedSongs state:', state.likedSongs);

  if (!state.likedSongs || state.likedSongs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-glass-light/20 backdrop-blur-sm rounded-3xl border border-white/5"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-glow-red/20 to-glow-pink/20 w-fit mx-auto mb-6">
          <Heart className="h-16 w-16 text-glow-red mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No Liked Songs Yet</h3>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          Start exploring and heart your favorite songs to build your personal collection
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
          <div className="p-3 rounded-2xl bg-gradient-to-r from-glow-red to-glow-pink shadow-lg">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Liked Songs</h2>
            <p className="text-gray-400 text-sm">{state.likedSongs.length} songs in your collection</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* First Row */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-6 min-w-max pb-4 justify-center">
              {state.likedSongs.slice(0, Math.ceil(state.likedSongs.length / 2)).map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TrackCard
                    index={index}
                    track={song}
                    onPlay={() => playTrack(song)}
                    onToggleLike={() => toggleLikeSong(song)}
                    isLiked={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Second Row */}
          {state.likedSongs.length > 1 && (
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-6 min-w-max pb-4 justify-center">
                {state.likedSongs.slice(Math.ceil(state.likedSongs.length / 2)).map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index + Math.ceil(state.likedSongs.length / 2)) * 0.05 }}
                  >
                    <TrackCard
                      index={index + Math.ceil(state.likedSongs.length / 2)}
                      track={song}
                      onPlay={() => playTrack(song)}
                      onToggleLike={() => toggleLikeSong(song)}
                      isLiked={true}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </>
  );
}
