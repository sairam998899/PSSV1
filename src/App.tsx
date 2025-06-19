import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Layout/Header';
import { SearchBar } from './components/Search/SearchBar';
import { MusicPlayer } from './components/Player/MusicPlayer';
import { RecentlyPlayed } from './components/Sections/RecentlyPlayed';
import { SearchResults } from './components/Sections/SearchResults';
import { Trending } from './components/Sections/Trending';
import { History } from './components/Sections/History';
import { Home, Search, TrendingUp, Clock } from 'lucide-react';

type Tab = 'home' | 'search' | 'trending' | 'history';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'history', label: 'History', icon: Clock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <RecentlyPlayed />;
      case 'search':
        return (
          <div className="space-y-8">
            <SearchBar />
            <SearchResults />
          </div>
        );
      case 'trending':
        return <Trending />;
      case 'history':
        return <History />;
      default:
        return <RecentlyPlayed />;
    }
  };

  return (
    <div className="min-h-screen bg-glass text-white">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-glow-blue/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-glow-blue/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-72 h-72 md:w-96 md:h-96 bg-glow-blue/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Navigation */}
      <nav className="sticky top-20 z-40 backdrop-blur-xl bg-glass border-b border-white/10">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-golden-500'
                      : 'text-golden-400 hover:text-golden-500 hover:bg-golden-900/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-glow-blue to-glow-green rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MusicPlayer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
