import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, Video, PlusCircle } from 'lucide-react';
import { YouTubeVideo } from '../../types';
import { useApp } from '../../contexts/AppContext';

import { Heart } from 'lucide-react';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface TrackCardProps {
  track: YouTubeVideo;
  index: number;
  showPlayedAt?: boolean;
  playedAt?: Date;
  onPlay?: () => void;
  onToggleLike?: () => void;
  isLiked?: boolean;
  onVideoPlay?: () => void;
}

export function TrackCard({ track, index, showPlayedAt, playedAt, onPlay, onToggleLike, isLiked, onVideoPlay }: TrackCardProps) {
  const { playTrack } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      playTrack(track);
    }
  };

  const handleVideoPlay = () => {
    if (onVideoPlay) {
      onVideoPlay();
    } else {
      playTrack(track, true); // pass true to indicate video play
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.05 }}
        className="group relative w-36 flex-shrink-0 rounded-2xl bg-glass-light backdrop-blur-sm border border-white/10 hover:border-glow-blue transition-all duration-300 hover:shadow-xl hover:shadow-glow-blue overflow-hidden"
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glow-blue/10 to-glow-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Thumbnail */}
        <div className="relative w-full aspect-square">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Play className="h-12 w-12 text-white ml-1" fill="currentColor" />
          </motion.button>

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all">
            {/* Like Button */}
            {onToggleLike && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleLike}
                className="p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-glow-blue/20 transition-colors"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'text-glow-blue' : 'text-white'}`} />
              </motion.button>
            )}

            {/* Add to Playlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openModal}
              className="p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-glow-green/20 transition-colors"
              title="Add to Playlist"
            >
              <PlusCircle className="h-4 w-4 text-green-400" />
            </motion.button>

            {/* Video Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleVideoPlay}
              className="p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-glow-red/20 transition-colors"
              title="Play Video"
            >
              <Video className="h-4 w-4 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Track Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-neon-aqua transition-colors">
            {track.title}
          </h3>
          <p className="text-gray-400 text-xs mb-2 truncate">
            {track.channelTitle}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {track.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{track.duration}</span>
                </div>
              )}
              {track.viewCount && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{track.viewCount}</span>
                </div>
              )}
            </div>
            {showPlayedAt && playedAt && (
              <span className="text-xs">
                {new Date(playedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </motion.div>
      <AddToPlaylistModal track={track} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
