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
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-glow-green to-glow-blue">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Listening History</h2>
            <p className="text-gray-400 text-sm">{state.history.length} total tracks</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearHistory}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-10 pr-4 py-2 bg-glass-light backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-aqua/50 transition-all"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-4 py-2 bg-glass-light backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-aqua/50 transition-all"
          />
        </div>
      </div>

      {/* History Groups */}
      <div className="space-y-8">
        {Object.entries(groupedHistory)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, tracks]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracks.map((track, index) => (
                  <TrackCard
                    key={`${track.id}-${track.playedAt}`}
                    track={track}
                    index={index}
                    showPlayedAt
                    playedAt={track.playedAt}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      {filteredHistory.length === 0 && (searchQuery || selectedDate) && (
        <div className="text-center py-8">
          <p className="text-gray-400">No tracks found matching your filters</p>
        </div>
      )}
    </motion.section>
  );
}