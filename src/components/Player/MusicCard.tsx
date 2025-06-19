import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface MusicCardProps {
  onToggleMinimize: () => void;
}

export function MusicCard({ onToggleMinimize }: MusicCardProps) {
  const { state, toggleLikeSong, setCardMinimized, setUserMinimized } = useApp();
  const [bgColor, setBgColor] = useState('rgba(255, 255, 255, 0.1)');

  // Extract dominant color from thumbnail image
  useEffect(() => {
    if (!state.currentTrack?.thumbnail) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = state.currentTrack.thumbnail;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4 * 10) { // sample every 10 pixels for performance
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      setBgColor(`rgba(${r}, ${g}, ${b}, 0.3)`);
    };
  }, [state.currentTrack?.thumbnail]);

  if (!state.currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: bgColor, backdropFilter: 'blur(20px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-white/10 border border-white/20 shadow-lg">
          {/* Close/Minimize Button */}
          <button
            onClick={() => {
              onToggleMinimize();
            }}
            aria-label="Minimize"
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-30"
          >
            <X size={28} />
          </button>

          {/* Thumbnail */}
          <img
            src={state.currentTrack.thumbnail.replace(/\/[^\/]+\.jpg$/, '/maxresdefault.jpg')}
            alt={state.currentTrack.title}
            className="w-full h-auto object-cover rounded-t-3xl"
          />

          {/* Track Info */}
          <div className="p-6 text-center">
            <h2 className="text-white text-3xl font-bold max-w-full overflow-hidden relative whitespace-nowrap">
              <span className="inline-block animate-marquee">{state.currentTrack.title}</span>
            </h2>
            <p className="text-gray-300 text-lg mt-2 max-w-full overflow-hidden relative whitespace-nowrap">
              {state.currentTrack.channelTitle}
            </p>

            {/* Like Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => toggleLikeSong(state.currentTrack!)}
                aria-label="Like"
                className="p-3 rounded-full bg-glass-light hover:bg-glow-blue/20 transition-colors"
              >
                <Heart
                  size={32}
                  className={
                    state.likedSongs.some((song) => song.id === state.currentTrack?.id)
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-glow-blue'
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
