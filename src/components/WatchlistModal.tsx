import React from 'react';
import { WatchlistReminder, Channel } from '../types/tv';
import { X, Trash2, Play, BookmarkCheck, Clock, Bell } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: WatchlistReminder[];
  onRemoveReminder: (programId: string) => void;
  onTuneInChannel: (channelId: string) => void;
  channels: Channel[];
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onRemoveReminder,
  onTuneInChannel,
  channels,
}) => {
  if (!isOpen) return null;

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
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">My Saved Reminders</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Upcoming programs, worship services, and sports games you flagged to watch.
        </p>

        {reminders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-600 mb-1" />
            <p className="text-sm font-medium text-slate-400">No show reminders saved yet</p>
            <p className="text-xs">Browse the TV Guide (EPG) or channel list and tap "Remind" to save upcoming broadcasts.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {reminders.map((item) => {
              const matchedChannel = channels.find((c) => c.id === item.channelId);

              return (
                <div
                  key={item.programId}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono mb-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Starts {item.startTime}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 truncate">{item.channelName}</span>
                    </div>

                    <h3 className="text-xs md:text-sm font-bold text-white truncate font-display">
                      {item.programTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onTuneInChannel(item.channelId);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Tune in to channel"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>Watch</span>
                    </button>

                    <button
                      onClick={() => onRemoveReminder(item.programId)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
