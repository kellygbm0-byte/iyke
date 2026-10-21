import React from 'react';
import { Tv, Radio, Plus, BookmarkCheck, Grid, HeartHandshake, Flame, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'live' | 'matches' | 'faith' | 'guide' | 'multiview';
  setActiveTab: (tab: 'live' | 'matches' | 'faith' | 'guide' | 'multiview') => void;
  onOpenAddModal: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenWatchlist,
  watchlistCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('live')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/40">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-display group-hover:text-amber-400 transition-colors">
                Iyke<span className="text-amber-400">TV</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Concise Nav Links (Single-Line, No Pills) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('live')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'live'
                ? 'border-amber-400 text-white font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4 text-slate-400" />
            Live Channels
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'matches'
                ? 'border-amber-400 text-rose-300 font-bold'
                : 'border-transparent hover:text-rose-300'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
            Live Games Transmission
          </button>

          <button
            onClick={() => setActiveTab('faith')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'faith'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent hover:text-amber-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            Christian Faith
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-amber-400 text-white font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4 text-slate-400" />
            TV Guide (EPG)
          </button>

          <button
            onClick={() => setActiveTab('multiview')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'multiview'
                ? 'border-amber-400 text-sky-300 font-bold'
                : 'border-transparent hover:text-sky-300'
            }`}
          >
            <Radio className="w-4 h-4 text-sky-400" />
            Multi-View (Dual)
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenWatchlist}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Saved Fixture & Sermon Reminders"
            aria-label="View saved reminders"
          >
            <BookmarkCheck className="w-5 h-5 text-slate-300" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-amber-400/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stream</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 gap-4 text-xs font-medium text-slate-300 scrollbar-none">
        <button
          onClick={() => setActiveTab('live')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'live' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'matches' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Live Games
        </button>
        <button
          onClick={() => setActiveTab('faith')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'faith' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Faith
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'guide' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          TV Guide
        </button>
        <button
          onClick={() => setActiveTab('multiview')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'multiview' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Dual Screen
        </button>
      </div>
    </header>
  );
};
