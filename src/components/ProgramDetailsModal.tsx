import React from 'react';
import { Program, Channel } from '../types/tv';
import { X, Play, Clock, BookmarkPlus, BookmarkCheck, Calendar, User, Film } from 'lucide-react';

interface ProgramDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  channel: Channel | null;
  onTuneIn: (channel: Channel) => void;
  onToggleReminder: (program: Program, channel: Channel) => void;
  isReminderSet: boolean;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  isOpen,
  onClose,
  program,
  channel,
  onTuneIn,
  onToggleReminder,
  isReminderSet,
}) => {
  if (!isOpen || !program || !channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Channel info banner */}
        <div className="flex items-center gap-2.5 mb-4 text-xs text-slate-400">
          <span className="text-xl">{channel.logo}</span>
          <span className="font-mono font-bold text-amber-400">CH {channel.number}</span>
          <span className="text-slate-600">·</span>
          <span className="font-semibold text-slate-200">{channel.name}</span>
          <span className="text-slate-600">·</span>
          <span className="capitalize">{channel.category}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white font-display mb-2">
          {program.title}
        </h2>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-mono text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{program.startTime} - {program.endTime}</span>
            <span className="text-slate-500">({program.durationMinutes} min)</span>
          </div>

          {program.rating && (
            <span className="font-mono text-slate-400">
              Rating: {program.rating}
            </span>
          )}

          {program.genre && (
            <span className="text-slate-400">
              Genre: {program.genre}
            </span>
          )}

          {program.year && (
            <span className="text-slate-400">
              Year: {program.year}
            </span>
          )}
        </div>

        {/* Speaker / Director / Creator */}
        {program.directorOrSpeaker && (
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-4 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Broadcast Lead: <strong className="text-white">{program.directorOrSpeaker}</strong></span>
          </div>
        )}

        {/* Stadium and Match Info if football */}
        {program.matchInfo && (
          <div className="flex items-center justify-between text-xs text-slate-300 mb-4 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400">Venue: </span>
              <strong className="text-white">{program.matchInfo.stadium}</strong>
            </div>
            <span className="font-mono font-bold text-amber-400">
              {program.matchInfo.competition}
            </span>
          </div>
        )}

        {/* Synopsis */}
        <div className="space-y-1 mb-6">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Synopsis</span>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => onToggleReminder(program, channel)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isReminderSet
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isReminderSet ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <span>Reminder Active</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Set Show Reminder</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onTuneIn(channel);
              onClose();
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-amber-400/20"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Tune To Channel Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
