import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Channel } from '../types/tv';
import { Volume2, VolumeX, ArrowLeftRight, Maximize, Play, Pause } from 'lucide-react';

interface MultiViewPlayerProps {
  channels: Channel[];
}

export const MultiViewPlayer: React.FC<MultiViewPlayerProps> = ({ channels }) => {
  const [channelAId, setChannelAId] = useState<string>(channels[0]?.id || '');
  const [channelBId, setChannelBId] = useState<string>(channels[5]?.id || channels[1]?.id || '');
  const [activeAudioScreen, setActiveAudioScreen] = useState<'A' | 'B'>('A');

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const hlsARef = useRef<Hls | null>(null);
  const hlsBRef = useRef<Hls | null>(null);

  const channelA = channels.find((c) => c.id === channelAId) || channels[0];
  const channelB = channels.find((c) => c.id === channelBId) || channels[1];

  // Setup Stream A
  useEffect(() => {
    const video = videoARef.current;
    if (!video || !channelA) return;

    if (hlsARef.current) {
      hlsARef.current.destroy();
      hlsARef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsARef.current = hls;
      hls.loadSource(channelA.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channelA.streamUrl;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsARef.current) {
        hlsARef.current.destroy();
        hlsARef.current = null;
      }
    };
  }, [channelA?.streamUrl]);

  // Setup Stream B
  useEffect(() => {
    const video = videoBRef.current;
    if (!video || !channelB) return;

    if (hlsBRef.current) {
      hlsBRef.current.destroy();
      hlsBRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsBRef.current = hls;
      hls.loadSource(channelB.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channelB.streamUrl;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsBRef.current) {
        hlsBRef.current.destroy();
        hlsBRef.current = null;
      }
    };
  }, [channelB?.streamUrl]);

  // Handle Audio Focus
  useEffect(() => {
    if (videoARef.current) {
      videoARef.current.muted = activeAudioScreen !== 'A';
    }
    if (videoBRef.current) {
      videoBRef.current.muted = activeAudioScreen !== 'B';
    }
  }, [activeAudioScreen]);

  const handleSwapScreens = () => {
    const temp = channelAId;
    setChannelAId(channelBId);
    setChannelBId(temp);
    setActiveAudioScreen(activeAudioScreen === 'A' ? 'B' : 'A');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Instructions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white font-display">
            Dual-Screen Multi-View Experience
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stream two live channels simultaneously. Tap either screen or the audio toggle to switch sound.
          </p>
        </div>

        <button
          onClick={handleSwapScreens}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap Left & Right</span>
        </button>
      </div>

      {/* 2-Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Screen 1 (Left) */}
        <div
          onClick={() => setActiveAudioScreen('A')}
          className={`relative rounded-xl overflow-hidden bg-black border-2 transition-all cursor-pointer ${
            activeAudioScreen === 'A'
              ? 'border-amber-400 shadow-lg shadow-amber-400/10'
              : 'border-slate-800 opacity-90 hover:opacity-100'
          }`}
        >
          <div className="aspect-video w-full bg-black relative">
            <video
              ref={videoARef}
              className="w-full h-full object-contain"
              playsInline
              autoPlay
            />

            {/* Top Channel Bar */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg">{channelA?.logo}</span>
                <select
                  value={channelAId}
                  onChange={(e) => {
                    e.stopPropagation();
                    setChannelAId(e.target.value);
                  }}
                  className="bg-slate-900/90 text-white text-xs font-semibold rounded px-2 py-1 border border-slate-700 focus:outline-none"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      CH {c.number} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audio Status */}
              <div
                className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                  activeAudioScreen === 'A'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-black/60 text-slate-400'
                }`}
              >
                {activeAudioScreen === 'A' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>AUDIO ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>MUTED</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-xs text-white z-10 flex items-center justify-between">
              <div className="truncate max-w-[80%]">
                <span className="text-amber-400 font-bold">Now: </span>
                <span>{channelA?.currentProgram.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Screen A</span>
            </div>
          </div>
        </div>

        {/* Screen 2 (Right) */}
        <div
          onClick={() => setActiveAudioScreen('B')}
          className={`relative rounded-xl overflow-hidden bg-black border-2 transition-all cursor-pointer ${
            activeAudioScreen === 'B'
              ? 'border-amber-400 shadow-lg shadow-amber-400/10'
              : 'border-slate-800 opacity-90 hover:opacity-100'
          }`}
        >
          <div className="aspect-video w-full bg-black relative">
            <video
              ref={videoBRef}
              className="w-full h-full object-contain"
              playsInline
              autoPlay
            />

            {/* Top Channel Bar */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg">{channelB?.logo}</span>
                <select
                  value={channelBId}
                  onChange={(e) => {
                    e.stopPropagation();
                    setChannelBId(e.target.value);
                  }}
                  className="bg-slate-900/90 text-white text-xs font-semibold rounded px-2 py-1 border border-slate-700 focus:outline-none"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      CH {c.number} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audio Status */}
              <div
                className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                  activeAudioScreen === 'B'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-black/60 text-slate-400'
                }`}
              >
                {activeAudioScreen === 'B' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>AUDIO ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>MUTED</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-xs text-white z-10 flex items-center justify-between">
              <div className="truncate max-w-[80%]">
                <span className="text-amber-400 font-bold">Now: </span>
                <span>{channelB?.currentProgram.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Screen B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
