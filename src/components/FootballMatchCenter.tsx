import React, { useState } from 'react';
import { FootballMatch, Channel } from '../types/tv';
import { LIVE_FOOTBALL_MATCHES } from '../data/channels';
import {
  Play,
  Activity,
  Flame,
  Shield,
  Clock,
  ChevronRight,
  TrendingUp,
  Tv,
  Radio,
  Sliders,
} from 'lucide-react';

interface FootballMatchCenterProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export const FootballMatchCenter: React.FC<FootballMatchCenterProps> = ({
  channels,
  onSelectChannel,
}) => {
  const [selectedComp, setSelectedComp] = useState<string>('All');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('All');
  const [expandedMatchId, setExpandedMatchId] = useState<string>(LIVE_FOOTBALL_MATCHES[0].id);

  const filteredMatches = LIVE_FOOTBALL_MATCHES.filter((match) => {
    const compMatch = selectedComp === 'All' || match.competition.includes(selectedComp);
    const netMatch = selectedNetwork === 'All' || match.channelName.toLowerCase().includes(selectedNetwork.toLowerCase());
    return compMatch && netMatch;
  });

  const handleTransmitGame = (channelId: string) => {
    const targetChannel = channels.find((c) => c.id === channelId);
    if (targetChannel) {
      onSelectChannel(targetChannel);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: All Inclusive Football Transmission */}
      <div className="bg-gradient-to-r from-red-950/60 via-slate-900/90 to-blue-950/60 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>LIVE FOOTBALL TRANSMISSION CENTER · IYKE TV</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              All Live Games Streaming
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time transmission of all live football fixtures across <strong className="text-white">Sky Sports</strong>, <strong className="text-white">TNT Sports</strong>, <strong className="text-white">DAZN</strong>, <strong className="text-white">beIN Sports</strong>, and <strong className="text-white">SuperSport</strong>. Tap any live match to transmit immediately.
            </p>
          </div>

          {/* Quick Network Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Sky Sports', color: 'border-red-600/60 bg-red-950/40 text-red-300' },
              { name: 'TNT Sports', color: 'border-amber-600/60 bg-amber-950/40 text-amber-300' },
              { name: 'DAZN', color: 'border-yellow-600/60 bg-yellow-950/40 text-yellow-300' },
              { name: 'beIN Sports', color: 'border-purple-600/60 bg-purple-950/40 text-purple-300' },
              { name: 'SuperSport', color: 'border-blue-600/60 bg-blue-950/40 text-blue-300' },
            ].map((net) => (
              <span
                key={net.name}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${net.color}`}
              >
                {net.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar: Competitions & Networks */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Competitions */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'All', label: 'All Leagues' },
            { id: 'Premier League', label: 'Premier League' },
            { id: 'Champions League', label: 'UCL' },
            { id: 'La Liga', label: 'La Liga' },
            { id: 'Serie A', label: 'Serie A' },
            { id: 'CAF', label: 'CAF / AFCON' },
            { id: 'FA Cup', label: 'FA Cup' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedComp(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedComp === item.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Network Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-500 font-medium shrink-0">Network:</span>
          {['All', 'Sky', 'TNT', 'DAZN', 'beIN', 'SuperSport'].map((net) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                selectedNetwork === net
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {net}
            </button>
          ))}
        </div>
      </div>

      {/* Live Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const isExpanded = expandedMatchId === match.id;

          return (
            <div
              key={match.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900/90 border-amber-400/60 shadow-xl shadow-amber-400/5'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Main Match Header Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Competition & Live Status */}
                <div className="flex items-center justify-between md:justify-start gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <span className="text-base">{match.competitionBadge}</span>
                    <span>{match.competition}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{match.minute}</span>
                  </div>
                </div>

                {/* Scoreline Center */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 my-1 md:my-0">
                  {/* Home Team */}
                  <div className="flex items-center gap-2.5 text-right w-36 sm:w-44 justify-end">
                    <span className="text-sm sm:text-base font-bold text-white font-display">
                      {match.homeTeam}
                    </span>
                    <span className="text-xl sm:text-2xl">{match.homeLogo}</span>
                  </div>

                  {/* Score */}
                  <div className="px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-wider shadow-inner">
                    {match.homeScore} : {match.awayScore}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-2.5 text-left w-36 sm:w-44 justify-start">
                    <span className="text-xl sm:text-2xl">{match.awayLogo}</span>
                    <span className="text-sm sm:text-base font-bold text-white font-display">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>

                {/* Action Controls: Transmit Live & View Stats */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Channel Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span>{match.channelLogo}</span>
                    <span className="truncate max-w-[140px] sm:max-w-none">{match.channelName}</span>
                  </div>

                  {/* Transmit Live Game CTA */}
                  <button
                    onClick={() => handleTransmitGame(match.channelId)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>TRANSMIT LIVE</span>
                  </button>

                  <button
                    onClick={() => setExpandedMatchId(isExpanded ? '' : match.id)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title={isExpanded ? 'Hide Match Stats' : 'Show Match Stats & Events'}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transform transition-transform ${
                        isExpanded ? 'rotate-90 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded Match Details: Live Stats & Goal Events */}
              {isExpanded && (
                <div className="bg-slate-950/70 border-t border-slate-800 p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Live Match Timeline / Events */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
                        <span>Match Timeline & Key Events</span>
                        <span className="text-slate-500">{match.venue}</span>
                      </div>

                      <div className="space-y-2">
                        {match.events.map((evt, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-2.5 text-xs p-2 rounded-lg ${
                              evt.team === 'home' ? 'bg-slate-900/60' : 'bg-slate-900/30'
                            }`}
                          >
                            <span className="font-mono font-bold text-amber-400 w-8 shrink-0">
                              {evt.minute}
                            </span>
                            <span className="shrink-0">
                              {evt.type === 'goal' ? '⚽' : evt.type === 'card' ? '🟨' : '🔄'}
                            </span>
                            <div>
                              <strong className="text-white">{evt.player}</strong>
                              {evt.detail && (
                                <span className="text-slate-400 ml-1.5">({evt.detail})</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Tactical Statistics */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
                        <span>Live Match Statistics</span>
                        <span className="text-slate-500">Ref: {match.referee}</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        {/* Possession Bar */}
                        <div>
                          <div className="flex justify-between font-semibold text-slate-300 mb-1">
                            <span>{match.stats.possessionHome}%</span>
                            <span className="text-slate-400 font-normal">Ball Possession</span>
                            <span>{match.stats.possessionAway}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full flex overflow-hidden">
                            <div
                              style={{ width: `${match.stats.possessionHome}%` }}
                              className="bg-amber-400 h-full"
                            />
                            <div
                              style={{ width: `${match.stats.possessionAway}%` }}
                              className="bg-blue-500 h-full"
                            />
                          </div>
                        </div>

                        {/* Shots */}
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="font-mono font-bold text-white">{match.stats.shotsHome}</span>
                          <span className="text-slate-400">Total Shots</span>
                          <span className="font-mono font-bold text-white">{match.stats.shotsAway}</span>
                        </div>

                        {/* Shots on Target */}
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="font-mono font-bold text-amber-400">{match.stats.shotsOnTargetHome}</span>
                          <span className="text-slate-400">Shots on Target</span>
                          <span className="font-mono font-bold text-amber-400">{match.stats.shotsOnTargetAway}</span>
                        </div>

                        {/* Corners */}
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="font-mono text-slate-300">{match.stats.cornersHome}</span>
                          <span className="text-slate-400">Corner Kicks</span>
                          <span className="font-mono text-slate-300">{match.stats.cornersAway}</span>
                        </div>

                        {/* Fouls */}
                        <div className="flex justify-between py-1">
                          <span className="font-mono text-slate-300">{match.stats.foulsHome}</span>
                          <span className="text-slate-400">Fouls</span>
                          <span className="font-mono text-slate-300">{match.stats.foulsAway}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
