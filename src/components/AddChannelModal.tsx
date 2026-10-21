import React, { useState } from 'react';
import { Channel } from '../types/tv';
import { X, Plus, Radio, Play, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: Channel) => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
}) => {
  const [name, setName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [network, setNetwork] = useState<Channel['network']>('Sky Sports');
  const [category, setCategory] = useState<'sports' | 'faith'>('sports');
  const [channelNumber, setChannelNumber] = useState<number>(501);
  const [tagline, setTagline] = useState('');
  const [logoEmoji, setLogoEmoji] = useState('⚽');
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleTestUrl = () => {
    if (!streamUrl.trim()) return;
    setTestSuccess(null);
    const isLikely =
      streamUrl.includes('.m3u8') ||
      streamUrl.includes('hls') ||
      streamUrl.includes('.mp4') ||
      streamUrl.startsWith('http');
    setTestSuccess(isLikely);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !streamUrl.trim()) return;

    const newChannel: Channel = {
      id: 'custom-' + Date.now(),
      number: Number(channelNumber) || 500,
      name: name.trim(),
      network: network,
      category: category,
      tagline: tagline.trim() || 'Custom Live Stream Transmission',
      streamUrl: streamUrl.trim(),
      logo: logoEmoji || (category === 'sports' ? '⚽' : '✝️'),
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
      resolution: '1080p FHD 60FPS',
      viewers: 1,
      programs: [
        {
          id: 'p-custom-1',
          title: 'Live Transmission Broadcast',
          description: 'Live continuous match or ministry feed.',
          startTime: '00:00',
          endTime: '23:59',
          durationMinutes: 1440,
          category: category,
          isLive: true,
        },
      ],
      currentProgram: {
        id: 'p-custom-1',
        title: 'Live Transmission Broadcast',
        description: 'Live continuous match or ministry feed.',
        startTime: '00:00',
        endTime: '23:59',
        durationMinutes: 1440,
        category: category,
        isLive: true,
      },
      nextProgram: {
        id: 'p-custom-2',
        title: 'Continuous Broadcast',
        description: 'Next live transmission segment.',
        startTime: 'Tomorrow',
        endTime: '23:59',
        durationMinutes: 1440,
        category: category,
      },
    };

    onAddChannel(newChannel);
    onClose();
  };

  const handleFillSample = (preset: 'sky' | 'supersport' | 'tnt' | 'bein' | 'emmanuel') => {
    if (preset === 'sky') {
      setName('Sky Sports Football Feed');
      setStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
      setCategory('sports');
      setNetwork('Sky Sports');
      setChannelNumber(212);
      setTagline('Live Premier League and EFL Championship games');
      setLogoEmoji('⚽');
    } else if (preset === 'supersport') {
      setName('SuperSport Premier League 2');
      setStreamUrl('https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8');
      setCategory('sports');
      setNetwork('SuperSport');
      setChannelNumber(213);
      setTagline('SuperSport English Premier League live transmission');
      setLogoEmoji('🔴');
    } else if (preset === 'tnt') {
      setName('TNT Sports Ultimate 4K');
      setStreamUrl('https://test-streams.mux.dev/test_001/stream.m3u8');
      setCategory('sports');
      setNetwork('TNT Sports');
      setChannelNumber(214);
      setTagline('UEFA Champions League live stadium audio and video');
      setLogoEmoji('🏆');
    } else if (preset === 'bein') {
      setName('beIN Sports Premium Extra');
      setStreamUrl('https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8');
      setCategory('sports');
      setNetwork('beIN Sports');
      setChannelNumber(215);
      setTagline('CAF Champions League, Ligue 1 & World Cup matches');
      setLogoEmoji('🟣');
    } else {
      setName('Emmanuel TV SCOAN Extra');
      setStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
      setCategory('faith');
      setNetwork('Faith TV');
      setChannelNumber(110);
      setTagline('Live Sunday service, prayers for the sick and prophetic word');
      setLogoEmoji('🕊️');
    }
    setTestSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">Add Live Stream Channel</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Add any live M3U8 HLS or MP4 football transmission or Christian faith feed to your Iyke TV guide.
        </p>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleFillSample('sky')}
            className="text-red-400 hover:underline font-semibold"
          >
            Sky Sports
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleFillSample('supersport')}
            className="text-blue-400 hover:underline font-semibold"
          >
            SuperSport
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleFillSample('tnt')}
            className="text-amber-400 hover:underline font-semibold"
          >
            TNT Sports
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleFillSample('bein')}
            className="text-purple-400 hover:underline font-semibold"
          >
            beIN
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleFillSample('emmanuel')}
            className="text-emerald-400 hover:underline font-semibold"
          >
            Emmanuel TV
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Stream URL (.m3u8 HLS or .mp4) *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://example.com/live/sports.m3u8"
                value={streamUrl}
                onChange={(e) => {
                  setStreamUrl(e.target.value);
                  setTestSuccess(null);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={handleTestUrl}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                Validate
              </button>
            </div>
            {testSuccess === true && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Stream URL format verified!
              </p>
            )}
            {testSuccess === false && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Please check that the URL starts with http(s)://
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Channel Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SuperSport EPL Extra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Channel Number
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={channelNumber}
                onChange={(e) => setChannelNumber(parseInt(e.target.value) || 500)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="sports">Live Sports & Football</option>
                <option value="faith">Christian Faith</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Network Tag
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="Sky Sports">Sky Sports</option>
                <option value="SuperSport">SuperSport</option>
                <option value="TNT Sports">TNT Sports</option>
                <option value="DAZN">DAZN</option>
                <option value="beIN Sports">beIN Sports</option>
                <option value="Faith TV">Christian Faith TV</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tagline / Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 24/7 Live football match transmissions"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Iyke TV Lineup</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
