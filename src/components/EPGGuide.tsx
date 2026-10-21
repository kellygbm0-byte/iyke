import React, { useState } from 'react';
import { Channel, Program } from '../types/tv';
import { Play, Clock, Info, BookmarkPlus, BookmarkCheck, Search } from 'lucide-react';

interface EPGGuideProps {
  channels: Channel[];
  currentChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  onOpenProgramModal: (program: Program, channel: Channel) => void;
  onToggleReminder: (program: Program, channel: Channel) => void;
  savedReminderIds: string[];
}

export const EPGGuide: React.FC<EPGGuideProps> = ({
  channels,
  currentChannel,
  onSelectChannel,
  onOpenProgramModal,
  onToggleReminder,
  savedReminderIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredChannels = channels.filter((ch) => {
    const matchesCat = selectedCategory === 'all' || ch.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.currentProgram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.programs.some((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Channels' },
            { id: 'sports', label: '⚽ Sky / TNT / DAZN / beIN / SuperSport' },
            { id: 'faith', label: '✝ Emmanuel TV & Christian Faith' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search show, pastor, team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Guide Table Container */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/90 text-xs font-mono text-slate-400 sticky top-0 z-10">
          <div className="w-56 sm:w-64 p-3 font-semibold text-slate-300 shrink-0 border-r border-slate-800">
            Channel Lineup
          </div>
          <div className="flex-1 flex overflow-x-auto scrollbar-none">
            <div className="min-w-[180px] p-3 border-r border-slate-800/60 font-semibold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Now Playing (10:00 - 11:30)</span>
            </div>
            <div className="min-w-[180px] p-3 border-r border-slate-800/60">
              Upcoming (11:30 - 13:00)
            </div>
            <div className="min-w-[180px] p-3 border-r border-slate-800/60">
              Afternoon (13:00 - 15:00)
            </div>
            <div className="min-w-[180px] p-3">
              Prime Evening (15:00+)
            </div>
          </div>
        </div>

        {/* Channel Rows */}
        <div className="divide-y divide-slate-800/60">
          {filteredChannels.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No broadcast schedules matched your filter criteria.
            </div>
          ) : (
            filteredChannels.map((channel) => {
              const isCurrent = channel.id === currentChannel.id;

              return (
                <div
                  key={channel.id}
                  className={`flex items-stretch hover:bg-slate-900/40 transition-colors ${
                    isCurrent ? 'bg-amber-400/5' : ''
                  }`}
                >
                  {/* Channel Header cell */}
                  <div
                    onClick={() => onSelectChannel(channel)}
                    className="w-56 sm:w-64 p-3 shrink-0 border-r border-slate-800 flex items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                        {channel.logo}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="font-mono font-bold text-amber-400">CH {channel.number}</span>
                          <span className="capitalize">· {channel.category}</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate font-display group-hover:text-amber-300">
                          {channel.name}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChannel(channel);
                      }}
                      className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-400 hover:text-slate-950 transition-colors"
                      title="Tune into channel"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Program blocks */}
                  <div className="flex-1 flex overflow-x-auto divide-x divide-slate-800/40 scrollbar-none">
                    {channel.programs.map((prog, idx) => {
                      const isReminderSet = savedReminderIds.includes(prog.id);

                      return (
                        <div
                          key={prog.id}
                          className={`min-w-[180px] p-3 flex flex-col justify-between group/card relative ${
                            idx === 0 ? 'bg-amber-400/10' : 'bg-transparent'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 mb-1">
                              <span className="font-mono text-slate-300">
                                {prog.startTime} - {prog.endTime}
                              </span>
                              {prog.rating && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {prog.rating}
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-semibold text-white line-clamp-1 group-hover/card:text-amber-300">
                              {prog.title}
                            </p>

                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {prog.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/40 text-[11px]">
                            <button
                              onClick={() => onOpenProgramModal(prog, channel)}
                              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={() => onToggleReminder(prog, channel)}
                              className={`flex items-center gap-1 transition-colors ${
                                isReminderSet ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                              }`}
                              title={isReminderSet ? 'Reminder set' : 'Remind me'}
                            >
                              {isReminderSet ? (
                                <>
                                  <BookmarkCheck className="w-3.5 h-3.5" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <>
                                  <BookmarkPlus className="w-3.5 h-3.5" />
                                  <span>Remind</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
