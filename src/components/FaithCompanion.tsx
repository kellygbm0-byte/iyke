import React, { useState, useEffect } from 'react';
import { Channel, PrayerRequest } from '../types/tv';
import { DAILY_SCRIPTURES, INITIAL_PRAYER_REQUESTS } from '../data/channels';
import {
  Heart,
  BookOpen,
  Send,
  FileText,
  Copy,
  Check,
  Play,
  Share2,
  Download,
  Users,
  Sparkles,
} from 'lucide-react';

interface FaithCompanionProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export const FaithCompanion: React.FC<FaithCompanionProps> = ({
  channels,
  onSelectChannel,
}) => {
  const [scriptureIndex, setScriptureIndex] = useState<number>(0);
  const [copiedScripture, setCopiedScripture] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);

  // Sermon notes saved locally
  const [sermonTitle, setSermonTitle] = useState<string>(() => {
    return localStorage.getItem('veritas_sermon_title') || '';
  });
  const [sermonNotes, setSermonNotes] = useState<string>(() => {
    return (
      localStorage.getItem('veritas_sermon_notes') ||
      'Key scripture: Philippians 4:6\n\nPoints:\n1. Peace comes through prayer and trust\n2. Gratitude shifts our perspective'
    );
  });

  // Prayer requests
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => {
    const saved = localStorage.getItem('veritas_prayer_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRAYER_REQUESTS;
      }
    }
    return INITIAL_PRAYER_REQUESTS;
  });

  const [newPrayerText, setNewPrayerText] = useState<string>('');
  const [newPrayerAuthor, setNewPrayerAuthor] = useState<string>('');
  const [newPrayerCategory, setNewPrayerCategory] = useState<PrayerRequest['category']>('General');
  const [prayedSet, setPrayedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('veritas_sermon_title', sermonTitle);
    localStorage.setItem('veritas_sermon_notes', sermonNotes);
  }, [sermonTitle, sermonNotes]);

  useEffect(() => {
    localStorage.setItem('veritas_prayer_requests', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  const faithChannels = channels.filter((ch) => ch.category === 'faith');
  const currentScripture = DAILY_SCRIPTURES[scriptureIndex];

  const handleNextScripture = () => {
    setScriptureIndex((prev) => (prev + 1) % DAILY_SCRIPTURES.length);
  };

  const handleCopyScripture = () => {
    navigator.clipboard.writeText(`"${currentScripture.text}" — ${currentScripture.verse}`);
    setCopiedScripture(true);
    setTimeout(() => setCopiedScripture(false), 2000);
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(`${sermonTitle}\n\n${sermonNotes}`);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const handleDownloadNotes = () => {
    const element = document.createElement('a');
    const file = new Blob([`${sermonTitle || 'Sermon Notes'}\n\n${sermonNotes}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${sermonTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'sermon_notes'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrayForRequest = (id: string) => {
    if (prayedSet.has(id)) return;
    setPrayedSet(new Set(prayedSet).add(id));
    setPrayerRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, prayingCount: req.prayingCount + 1 } : req))
    );
  };

  const handleAddPrayerRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerText.trim()) return;

    const newReq: PrayerRequest = {
      id: 'pr-' + Date.now(),
      author: newPrayerAuthor.trim() || 'Fellow Believer',
      text: newPrayerText.trim(),
      timestamp: 'Just now',
      prayingCount: 1,
      category: newPrayerCategory,
    };

    setPrayerRequests([newReq, ...prayerRequests]);
    setNewPrayerText('');
    setNewPrayerAuthor('');
  };

  return (
    <div className="space-y-8">
      {/* Daily Scripture Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-indigo-950/40 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>DAILY SCRIPTURE MEDITATION</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-normal">{currentScripture.theme}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyScripture}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedScripture ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScripture ? 'Copied' : 'Copy Verse'}</span>
            </button>
            <button
              onClick={handleNextScripture}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-semibold hover:bg-amber-300 transition-colors"
            >
              Next Verse
            </button>
          </div>
        </div>

        <blockquote className="text-lg md:text-xl font-medium text-slate-100 font-display leading-relaxed italic max-w-4xl">
          "{currentScripture.text}"
        </blockquote>

        <p className="mt-3 text-sm font-bold text-amber-400 font-mono tracking-wide">
          — {currentScripture.verse}
        </p>
      </div>

      {/* Faith Channels Quick Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Christian Faith Television Networks</h2>
            <p className="text-xs text-slate-400 mt-0.5">Stream 24/7 global worship, miracles, and preaching on Emmanuel TV, TBN, Dunamis, LoveWorld & Daystar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faithChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onSelectChannel(channel)}
              className="group bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  {channel.logo}
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-bold text-amber-400">CH {channel.number}</span>
                  <h3 className="text-sm font-bold text-white truncate font-display group-hover:text-amber-300">
                    {channel.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {channel.currentProgram.title}
                  </p>
                </div>
              </div>

              <button
                className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shrink-0"
                title="Watch broadcast"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Sermon Notes & Prayer Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Sermon Notes Pad */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white font-display uppercase tracking-wide">
                Live Sermon Notes
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNotes}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy sermon notes to clipboard"
              >
                {copiedNotes ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownloadNotes}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Download notes as .txt file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Sermon Title / Preacher / Date"
            value={sermonTitle}
            onChange={(e) => setSermonTitle(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mb-3 font-semibold"
          />

          <textarea
            placeholder="Write scriptures, sermon insights, personal revelations, and life applications here while you stream..."
            value={sermonNotes}
            onChange={(e) => setSermonNotes(e.target.value)}
            rows={12}
            className="w-full flex-1 bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-sans resize-y"
          />

          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Notes auto-save locally to your browser.</span>
            <span>{sermonNotes.length} characters</span>
          </div>
        </div>

        {/* Right Column: Prayer Wall & Community Board */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-white font-display uppercase tracking-wide">
                Community Prayer Wall
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {prayerRequests.length} Requests
            </span>
          </div>

          {/* Submit prayer form */}
          <form onSubmit={handleAddPrayerRequest} className="mb-6 space-y-2.5 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your Name / City (Optional)"
                value={newPrayerAuthor}
                onChange={(e) => setNewPrayerAuthor(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <select
                value={newPrayerCategory}
                onChange={(e) => setNewPrayerCategory(e.target.value as PrayerRequest['category'])}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
              >
                <option value="Healing">Healing</option>
                <option value="Family">Family</option>
                <option value="Guidance">Guidance</option>
                <option value="Thanksgiving">Thanksgiving</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share a prayer request or praise report..."
                value={newPrayerText}
                onChange={(e) => setNewPrayerText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Prayer Request List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {prayerRequests.map((req) => {
              const hasPrayed = prayedSet.has(req.id);

              return (
                <div
                  key={req.id}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2 text-left"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{req.author}</span>
                      {req.location && (
                        <span className="text-slate-400">· {req.location}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-amber-400/90 font-medium">
                      {req.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {req.text}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                    <span>{req.timestamp}</span>

                    <button
                      onClick={() => handlePrayForRequest(req.id)}
                      disabled={hasPrayed}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                        hasPrayed
                          ? 'bg-rose-500/10 text-rose-300 font-semibold cursor-default'
                          : 'bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 cursor-pointer'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{hasPrayed ? 'Praying with you' : 'Amen / Pray'}</span>
                      <span className="font-mono tabular-nums text-slate-400 font-bold">
                        ({req.prayingCount})
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
