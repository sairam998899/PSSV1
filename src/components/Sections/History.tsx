import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Trash2, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { TrackCard } from '../Tracks/TrackCard';
import { StorageService } from '../../services/storage';

export function History() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const clearHistory = () => {
    StorageService.setHistory([]);
    dispatch({ type: 'LOAD_STORAGE_DATA' });
  };

  const filteredHistory = state.history.filter((track) => {
    const matchesSearch = searchQuery === '' || 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.channelTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = selectedDate === '' || 
      new Date(track.playedAt).toDateString() === new Date(selectedDate).toDateString();
    
    return matchesSearch && matchesDate;
  });

  const groupedHistory = filteredHistory.reduce((groups, track) => {
    const date = new Date(track.playedAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(track);
    return groups;
  }, {} as Record<string, typeof filteredHistory>);

  if (state.history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl text-gray-400 mb-2">No Listening History</h3>
        <p className="text-gray-500">Your complete listening history will appear here</p>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-br from-glow-blue via-glow-green to-glow-blue shadow-lg shadow-glow-blue/20">
            <Clock className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Listening History
            </h1>
            <p className="text-gray-400 text-sm mt-1">{state.history.length} tracks in your journey</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={clearHistory}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
        >
          <Trash2 className="h-4 w-4" />
          <span className="font-medium">Clear History</span>
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass-light/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your listening history..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-aqua/60 focus:bg-white/10 transition-all duration-300 text-sm"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-neon-aqua/60 focus:bg-white/10 transition-all duration-300 text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* History Groups */}
      <div className="space-y-10">
        {Object.entries(groupedHistory)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, tracks], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="space-y-6"
            >
              {/* Date Header */}
              <div className="flex items-center space-x-3">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                <div className="px-4 py-2 bg-gradient-to-r from-glow-blue/20 to-glow-green/20 rounded-full border border-white/10">
                  <h3 className="text-sm font-semibold text-white">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                    })}
                  </h3>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
              </div>

              {/* Tracks */}
              <div className="overflow-x-auto pb-2 hide-scrollbar">
                <div className="flex space-x-4 min-w-max px-2">
                  {tracks.map((track, index) => (
                    <motion.div
                      key={`${track.id}-${track.playedAt}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
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
            </motion.div>
          ))}
      </div>

      {filteredHistory.length === 0 && (searchQuery || selectedDate) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">No tracks found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or date filters</p>
        </motion.div>
      )}
    </motion.section>
  );
}