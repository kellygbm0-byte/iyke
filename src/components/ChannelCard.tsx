import React from 'react';
import { Play, Heart, Users, Activity } from 'lucide-react';
import { Channel } from '../types/tv';

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isActive,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const isMatch = !!channel.currentProgram.matchInfo;
  const matchInfo = channel.currentProgram.matchInfo;

  return (
    <div
      onClick={() => onSelect(channel)}
      className={`group relative rounded-xl p-4 transition-all cursor-pointer border text-left flex flex-col justify-between ${
        isActive
          ? 'bg-slate-900/90 border-amber-400/80 shadow-lg shadow-amber-400/10 ring-1 ring-amber-400/50'
          : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Header: Channel Number, Network, Logo, and Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              {channel.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono font-bold text-amber-400">CH {channel.number}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-300">{channel.network}</span>
                <span aria-hidden="true">·</span>
                <span>{channel.resolution}</span>
              </div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-amber-300 transition-colors line-clamp-1">
                {channel.name}
              </h3>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(channel.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Current Live Broadcast / Match info */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              {isMatch ? `LIVE TRANSMISSION · ${matchInfo?.minute}` : 'LIVE NOW'}
            </span>
            {isMatch && (
              <span className="font-mono font-bold text-amber-400 text-xs">
                {matchInfo?.homeScore} : {matchInfo?.awayScore}
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-200 line-clamp-1">
            {channel.currentProgram.title}
          </p>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {channel.currentProgram.description}
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-amber-400/80 rounded-full w-[65%]" />
        </div>

        {/* Next Up show preview */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-slate-500 font-medium">Next:</span>
          <span className="text-slate-300 truncate">{channel.nextProgram.title}</span>
          <span className="text-slate-500 shrink-0 font-mono">({channel.nextProgram.startTime})</span>
        </div>
      </div>

      {/* Footer: Viewers & Play Action */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-2 border-t border-slate-800/40">
        <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-400">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>{channel.viewers.toLocaleString()} viewing</span>
        </div>

        <div className="flex items-center gap-1 text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Watch Live</span>
          <Play className="w-3.5 h-3.5 fill-amber-400" />
        </div>
      </div>
    </div>
  );
};
