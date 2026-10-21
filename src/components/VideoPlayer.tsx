import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  PictureInPicture,
  RefreshCw,
  Sliders,
  Radio,
  Tv,
  Info,
  Layers,
  Heart,
} from 'lucide-react';
import { Channel } from '../types/tv';

interface VideoPlayerProps {
  channel: Channel;
  onPrevChannel: () => void;
  onNextChannel: () => void;
  onToggleFavorite: (channelId: string) => void;
  isFavorite: boolean;
  isTheaterMode: boolean;
  onToggleTheaterMode: () => void;
  onOpenProgramDetails: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  onPrevChannel,
  onNextChannel,
  onToggleFavorite,
  isFavorite,
  isTheaterMode,
  onToggleTheaterMode,
  onOpenProgramDetails,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [activeUrl, setActiveUrl] = useState<string>(channel.streamUrl);
  const [qualityLevels, setQualityLevels] = useState<string[]>(['Auto', '1080p', '720p', '480p']);
  const [currentQuality, setCurrentQuality] = useState<string>('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | 'fill'>('16:9');
  const [audioOnly, setAudioOnly] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync activeUrl when channel changes
  useEffect(() => {
    setActiveUrl(channel.streamUrl);
    setStreamError(null);
    setIsLoading(true);
  }, [channel.id, channel.streamUrl]);

  // Load stream via HLS.js or native HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setStreamError(null);

    const isHls = activeUrl.includes('.m3u8') || activeUrl.includes('hls');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hlsRef.current = hls;
      hls.loadSource(activeUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        if (data.levels && data.levels.length > 0) {
          const levels = ['Auto', ...data.levels.map((lvl) => `${lvl.height}p`)];
          setQualityLevels(Array.from(new Set(levels)));
        }
        video.play().catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              // Try fallback stream if available
              if (channel.fallbackStreamUrl && activeUrl !== channel.fallbackStreamUrl) {
                setActiveUrl(channel.fallbackStreamUrl);
              } else {
                setStreamError('Unable to connect to live transmission. Try refreshing or switching channels.');
                setIsLoading(false);
              }
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || !isHls) {
      // Native Safari HLS or direct MP4/WebM
      video.src = activeUrl;
      video.load();
      video.play().catch(() => {
        setIsPlaying(false);
      });
      setIsLoading(false);
    } else {
      setStreamError('HLS playback is not supported in this browser environment.');
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeUrl, channel.fallbackStreamUrl]);

  // Volume & Mute handling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Auto-hide controls timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3500);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP not supported or blocked
    }
  };

  const handleRetryStream = () => {
    setStreamError(null);
    setIsLoading(true);
    if (channel.fallbackStreamUrl && activeUrl !== channel.fallbackStreamUrl) {
      setActiveUrl(channel.fallbackStreamUrl);
    } else {
      setActiveUrl(channel.streamUrl + (channel.streamUrl.includes('?') ? '&' : '?') + 't=' + Date.now());
    }
  };

  const handleQualitySelect = (qual: string) => {
    setCurrentQuality(qual);
    setShowQualityMenu(false);
    if (!hlsRef.current) return;
    if (qual === 'Auto') {
      hlsRef.current.currentLevel = -1;
    } else {
      const height = parseInt(qual.replace('p', ''), 10);
      const levelIndex = hlsRef.current.levels.findIndex((lvl) => lvl.height === height);
      if (levelIndex !== -1) {
        hlsRef.current.currentLevel = levelIndex;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl transition-all border border-slate-800 ${
        isTheaterMode ? 'w-full aspect-[21/9] min-h-[440px] max-h-[720px]' : 'w-full aspect-video min-h-[300px]'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className={`w-full h-full ${
          audioOnly ? 'opacity-20 blur-md' : ''
        } ${
          aspectRatio === 'fill'
            ? 'object-cover'
            : aspectRatio === '4:3'
            ? 'object-contain max-w-[75%] mx-auto'
            : 'object-contain'
        }`}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {/* Audio-only graphic backdrop */}
      {audioOnly && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/95 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 animate-pulse">
            <Radio className="w-8 h-8" />
          </div>
          <p className="text-xl font-bold text-white font-display">{channel.name}</p>
          <p className="text-sm text-slate-400 mt-1">Audio-Only Live Stream Active</p>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && !streamError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">Connecting to Feed...</span>
          </div>
        </div>
      )}

      {/* Error Fallback Overlay */}
      {streamError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 z-20">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
            <RefreshCw className="w-6 h-6 animate-spin-reverse" />
          </div>
          <p className="text-white font-semibold text-base mb-1">Live Feed Unavailable</p>
          <p className="text-slate-400 text-xs max-w-md mb-4">{streamError}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRetryStream}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reconnect / Fallback
            </button>
            <button
              onClick={onNextChannel}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              Next Channel
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Overlay: Channel & Program Banner */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent transition-opacity duration-300 z-10 flex items-start justify-between gap-4 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl px-2 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 shadow-md">
            {channel.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                CH {channel.number}
              </span>
              <span className="text-slate-500 text-xs font-bold">·</span>
              <h2 className="text-sm md:text-base font-bold text-white font-display tracking-tight">
                {channel.name}
              </h2>
              <span className="text-slate-500 text-xs font-bold">·</span>
              <span className="text-xs text-slate-300 capitalize">{channel.category}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span className="font-semibold text-slate-100">{channel.currentProgram.title}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{channel.currentProgram.startTime} - {channel.currentProgram.endTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600/90 text-white text-xs font-bold rounded-md tracking-wider shadow-sm shadow-red-900/40">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(channel.id)}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isFavorite ? 'bg-amber-400 text-slate-950' : 'bg-slate-900/80 text-white hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-slate-950' : ''}`} />
          </button>

          {/* Program Info button */}
          <button
            onClick={onOpenProgramDetails}
            className="p-2 rounded-lg bg-slate-900/80 text-white hover:bg-slate-800 backdrop-blur-md transition-colors"
            title="Program Details & Synopsis"
            aria-label="View program details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Big Play/Pause Center Trigger */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-transparent cursor-pointer z-0 focus:outline-none"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {!isPlaying && (
          <div className="w-16 h-16 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-400/30 transform hover:scale-110 active:scale-95 transition-transform">
            <Play className="w-8 h-8 fill-slate-950 ml-1" />
          </div>
        )}
      </button>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-10 flex flex-col gap-2 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar of current show */}
        <div className="w-full flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{channel.currentProgram.startTime}</span>
          <div className="flex-1 h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative">
            <div className="h-full bg-amber-400 rounded-full w-[45%]" />
          </div>
          <span>{channel.currentProgram.endTime}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left Controls: Play/Pause, Channel Surfing, Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:text-amber-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Prev Channel / Next Channel */}
            <div className="flex items-center bg-slate-900/80 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={onPrevChannel}
                className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs font-semibold flex items-center gap-0.5"
                title="Previous Channel (CH-)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>CH-</span>
              </button>
              <div className="w-px h-4 bg-slate-800" />
              <button
                onClick={onNextChannel}
                className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs font-semibold flex items-center gap-0.5"
                title="Next Channel (CH+)"
              >
                <span>CH+</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-slate-700 accent-amber-400 rounded-lg cursor-pointer"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Right Controls: Quality, Audio Mode, Aspect Ratio, PiP, Theater, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Audio-only toggle */}
            <button
              onClick={() => setAudioOnly(!audioOnly)}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                audioOnly ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={audioOnly ? 'Switch to Full Video' : 'Audio-Only Radio Mode (Data Saver)'}
              aria-label="Toggle audio mode"
            >
              <Radio className="w-4 h-4" />
            </button>

            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="px-2.5 py-1 rounded bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1"
                title="Select Stream Quality"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentQuality}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-28 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1 z-30">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Resolution</div>
                  {qualityLevels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleQualitySelect(lvl)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${
                        currentQuality === lvl ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Aspect Ratio Toggle */}
            <button
              onClick={() => {
                setAspectRatio((prev) => (prev === '16:9' ? '4:3' : prev === '4:3' ? 'fill' : '16:9'));
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors text-xs font-mono"
              title={`Aspect Ratio: ${aspectRatio}`}
              aria-label="Toggle aspect ratio"
            >
              {aspectRatio}
            </button>

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors hidden sm:block"
              title="Picture in Picture"
              aria-label="Picture in picture"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Theater Mode */}
            <button
              onClick={onToggleTheaterMode}
              className={`p-2 rounded-lg transition-colors hidden md:block ${
                isTheaterMode ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Theater Mode"
              aria-label="Theater mode"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
