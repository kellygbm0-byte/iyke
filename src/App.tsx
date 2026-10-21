import React, { useState, useEffect } from 'react';
import { Channel, Program, WatchlistReminder } from './types/tv';
import { INITIAL_CHANNELS } from './data/channels';
import { Navbar } from './components/Navbar';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelCard } from './components/ChannelCard';
import { FootballMatchCenter } from './components/FootballMatchCenter';
import { EPGGuide } from './components/EPGGuide';
import { FaithCompanion } from './components/FaithCompanion';
import { MultiViewPlayer } from './components/MultiViewPlayer';
import { AddChannelModal } from './components/AddChannelModal';
import { ProgramDetailsModal } from './components/ProgramDetailsModal';
import { WatchlistModal } from './components/WatchlistModal';
import {
  Search,
  Radio,
  Tv,
  Heart,
  Activity,
  CheckCircle,
  Info,
  Clock,
  Flame,
  Shield,
} from 'lucide-react';

export default function App() {
  // All channels (initial + user custom channels)
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('iyketv_custom_channels');
    if (saved) {
      try {
        const custom = JSON.parse(saved);
        return [...INITIAL_CHANNELS, ...custom];
      } catch {
        return INITIAL_CHANNELS;
      }
    }
    return INITIAL_CHANNELS;
  });

  // Current active channel in player (Default: Sky Sports Premier League)
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'live' | 'matches' | 'faith' | 'guide' | 'multiview'>('live');

  // Category filter on Live TV view
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sports' | 'faith' | 'favorites'>('all');

  // Specific network filter on Live TV view
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');

  // Search input for channels
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Theater mode
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('iyketv_favorite_channel_ids');
    return saved
      ? JSON.parse(saved)
      : ['ch-skysports-pl', 'ch-supersport-pl', 'ch-tnt-sports-1', 'ch-emmanuel-tv'];
  });

  // Saved program / match reminders
  const [reminders, setReminders] = useState<WatchlistReminder[]>(() => {
    const saved = localStorage.getItem('iyketv_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<{ program: Program; channel: Channel } | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('iyketv_favorite_channel_ids', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('iyketv_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleFavorite = (channelId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(channelId);
      const updated = isFav ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites ★');
      return updated;
    });
  };

  const handleToggleReminder = (program: Program, channel: Channel) => {
    setReminders((prev) => {
      const exists = prev.some((r) => r.programId === program.id);
      if (exists) {
        showToast(`Reminder removed for "${program.title}"`);
        return prev.filter((r) => r.programId !== program.id);
      } else {
        showToast(`Reminder set for "${program.title}" at ${program.startTime}!`);
        return [
          ...prev,
          {
            programId: program.id,
            channelId: channel.id,
            channelName: channel.name,
            programTitle: program.title,
            startTime: program.startTime,
            savedAt: new Date().toLocaleTimeString(),
          },
        ];
      }
    });
  };

  const handleAddCustomChannel = (newChannel: Channel) => {
    const customOnly = channels.filter((c) => c.id.startsWith('custom-'));
    const updatedCustom = [...customOnly, newChannel];
    localStorage.setItem('iyketv_custom_channels', JSON.stringify(updatedCustom));
    setChannels([...channels, newChannel]);
    setCurrentChannel(newChannel);
    setActiveTab('live');
    showToast(`Channel "${newChannel.name}" added to Iyke TV!`);
  };

  const handlePrevChannel = () => {
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    setCurrentChannel(channels[prevIndex]);
  };

  const handleNextChannel = () => {
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    setCurrentChannel(channels[nextIndex]);
  };

  // Filter channels
  const filteredChannels = channels.filter((ch) => {
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(ch.id)) return false;
    } else if (selectedCategory !== 'all' && ch.category !== selectedCategory) {
      return false;
    }

    if (selectedNetwork !== 'all') {
      if (!ch.network.toLowerCase().includes(selectedNetwork.toLowerCase())) {
        return false;
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchNetwork = ch.network.toLowerCase().includes(q);
      const matchShow = ch.currentProgram.title.toLowerCase().includes(q);
      const matchNumber = ch.number.toString().includes(q);
      if (!matchName && !matchNetwork && !matchShow && !matchNumber) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Iyke TV Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenWatchlist={() => setIsWatchlistModalOpen(true)}
        watchlistCount={reminders.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* VIEW 1: LIVE CHANNELS & VIDEO PLAYER */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            {/* Live Transmission Player Hero */}
            <div className="space-y-4">
              <VideoPlayer
                channel={currentChannel}
                onPrevChannel={handlePrevChannel}
                onNextChannel={handleNextChannel}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(currentChannel.id)}
                isTheaterMode={isTheaterMode}
                onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
                onOpenProgramDetails={() =>
                  setSelectedProgram({
                    program: currentChannel.currentProgram,
                    channel: currentChannel,
                  })
                }
              />

              {/* Player Quick Info & Live Transmission Status Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono font-bold text-amber-400">CH {currentChannel.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-white">{currentChannel.network}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentChannel.resolution}</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-white font-display">
                    {currentChannel.currentProgram.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  <button
                    onClick={() => setActiveTab('matches')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>View All Live Games</span>
                  </button>

                  <button
                    onClick={() =>
                      setSelectedProgram({
                        program: currentChannel.currentProgram,
                        channel: currentChannel,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Match / Show Details</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Channel Surfer & Network Selector Bar */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
                {/* Primary Category Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Channels' },
                    { id: 'sports', label: '⚽ Live Sports & Football' },
                    { id: 'faith', label: '✝ Christian Faith TV' },
                    { id: 'favorites', label: `★ Favorites (${favorites.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedCategory(tab.id as any);
                        setSelectedNetwork('all');
                      }}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === tab.id
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Sky, SuperSport, Emmanuel TV..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Sub-Network Quick Filter Strip */}
              {selectedCategory !== 'faith' && (
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  <span className="text-xs text-slate-500 font-semibold shrink-0">Football Networks:</span>
                  {[
                    { id: 'all', label: 'All Networks' },
                    { id: 'sky', label: 'Sky Sports' },
                    { id: 'supersport', label: 'SuperSport' },
                    { id: 'tnt', label: 'TNT Sports' },
                    { id: 'dazn', label: 'DAZN' },
                    { id: 'bein', label: 'beIN Sports' },
                  ].map((net) => (
                    <button
                      key={net.id}
                      onClick={() => setSelectedNetwork(net.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                        selectedNetwork === net.id
                          ? 'bg-slate-700 text-white border border-slate-600'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                      }`}
                    >
                      {net.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Channels Lineup Grid */}
            <div>
              {filteredChannels.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2 bg-slate-900/20 rounded-xl border border-slate-800/60">
                  <p className="text-sm font-medium text-slate-400">No channels matched your criteria</p>
                  <p className="text-xs">Try selecting 'All Channels' or clearing your search filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredChannels.map((ch) => (
                    <ChannelCard
                      key={ch.id}
                      channel={ch}
                      isActive={ch.id === currentChannel.id}
                      isFavorite={favorites.includes(ch.id)}
                      onSelect={(selected) => {
                        setCurrentChannel(selected);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: ALL LIVE GAMES TRANSMISSION (FOOTBALL PURPOSES) */}
        {activeTab === 'matches' && (
          <FootballMatchCenter
            channels={channels}
            onSelectChannel={(ch) => {
              setCurrentChannel(ch);
              setActiveTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 3: CHRISTIAN FAITH CHANNELS & COMMUNITY */}
        {activeTab === 'faith' && (
          <FaithCompanion
            channels={channels}
            onSelectChannel={(ch) => {
              setCurrentChannel(ch);
              setActiveTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 4: TV GUIDE (EPG) */}
        {activeTab === 'guide' && (
          <EPGGuide
            channels={channels}
            currentChannel={currentChannel}
            onSelectChannel={(ch) => {
              setCurrentChannel(ch);
              setActiveTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProgramModal={(prog, ch) => {
              setSelectedProgram({ program: prog, channel: ch });
            }}
            onToggleReminder={handleToggleReminder}
            savedReminderIds={reminders.map((r) => r.programId)}
          />
        )}

        {/* VIEW 5: DUAL-SCREEN MULTI-VIEW */}
        {activeTab === 'multiview' && (
          <MultiViewPlayer channels={channels} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-display">Iyke TV</span>
            <span>·</span>
            <span>Live Football Transmission & Christian Television</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span>Sky Sports</span>
            <span>·</span>
            <span>SuperSport</span>
            <span>·</span>
            <span>TNT Sports</span>
            <span>·</span>
            <span>DAZN</span>
            <span>·</span>
            <span>beIN Sports</span>
            <span>·</span>
            <span>Emmanuel TV & Faith Networks</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-400/60 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce-short">
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Custom Stream Modal */}
      <AddChannelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddChannel={handleAddCustomChannel}
      />

      {/* Program Details Modal */}
      <ProgramDetailsModal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        program={selectedProgram?.program || null}
        channel={selectedProgram?.channel || null}
        onTuneIn={(ch) => {
          setCurrentChannel(ch);
          setActiveTab('live');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToggleReminder={handleToggleReminder}
        isReminderSet={
          selectedProgram
            ? reminders.some((r) => r.programId === selectedProgram.program.id)
            : false
        }
      />

      {/* Watchlist Reminders Modal */}
      <WatchlistModal
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        reminders={reminders}
        onRemoveReminder={(progId) => {
          setReminders((prev) => prev.filter((r) => r.programId !== progId));
          showToast('Reminder removed');
        }}
        onTuneInChannel={(chId) => {
          const target = channels.find((c) => c.id === chId);
          if (target) {
            setCurrentChannel(target);
            setActiveTab('live');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        channels={channels}
      />
    </div>
  );
}
