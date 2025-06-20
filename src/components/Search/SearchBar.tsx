import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { YouTubeService } from '../../services/youtube';

const languageSuggestions: Record<string, string[]> = {
  all: ['Pop Music', 'Rock Classics', 'Indie Hits', 'Electronic', 'Jazz'],
  telugu: ['Telugu Hits', 'Tollywood Songs', 'Telugu Classics', 'Telugu Folk', 'Telugu Devotional'],
  hindi: ['Bollywood Hits', 'Hindi Classics', 'Hindi Pop', 'Hindi Devotional', 'Hindi Remix'],
  english: ['Pop Music', 'Rock Classics', 'Indie Hits', 'Electronic', 'Jazz'],
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch, state } = useApp();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      console.log(`Searching for "${query}" with language "${state.language}"`);
      let results = await YouTubeService.searchVideos(query, 20, state.language);
      if (results.length === 0 && state.language !== 'all') {
        console.log('No results found with current language filter, retrying with language "all"');
        results = await YouTubeService.searchVideos(query, 20, 'all');
      }
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
      console.log(`Search returned ${results.length} results`);
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = languageSuggestions[state.language] || languageSuggestions['all'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, or videos..."
            className="w-full px-6 py-4 pl-14 bg-glass-dark backdrop-blur-sm border border-white/20 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-neon-aqua/50 focus:ring-2 focus:ring-neon-aqua/20 transition-all"
            style={{ color: 'black', caretColor: 'black' }}
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-neon-aqua transition-colors" />
          
          <motion.button
            type="submit"
            disabled={isLoading || !query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-glow-blue to-glow-green rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-glow-blue/25"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </motion.button>
        </div>
      </form>

      {/* Search suggestions could go here */}
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion}
            whileHover={{ scale: 1.05 }}
            onClick={() => setQuery(suggestion)}
            className="px-4 py-2 bg-glass-light backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300 hover:border-neon-purple/50 hover:text-white transition-all"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
