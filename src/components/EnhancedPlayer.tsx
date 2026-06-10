"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Gauge, PictureInPicture2 } from "lucide-react";

interface EnhancedPlayerProps {
  src: string;
  title: string;
  onProgress?: (percent: number) => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function EnhancedPlayer({ src, title, onProgress }: EnhancedPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const hideTimeout = useRef<NodeJS.Timeout>(null);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const video = videoRef.current;
      if (!video) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          setMuted((m) => { video.muted = !m; return !m; });
          break;
        case "arrowleft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "arrowright":
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
        case "arrowup":
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          break;
        case "p":
          e.preventDefault();
          togglePiP();
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playing]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      container.requestFullscreen();
      setFullscreen(true);
    }
  }

  function togglePiP() {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      video.requestPictureInPicture();
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    setProgress(pct);
    setCurrentTime(video.currentTime);
    onProgress?.(pct);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  }

  function changeSpeed(s: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = s;
    setSpeed(s);
    setShowSpeed(false);
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[9/16] sm:aspect-video max-h-[80vh] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group mx-auto"
      onMouseMove={resetHideTimer}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {/* Clickable area for play/pause (covers entire video area except bottom controls) */}
      <div
        className="absolute inset-0 bottom-16 cursor-pointer z-10"
        onClick={togglePlay}
      />

      {/* Center play button (visual only, click handled by area above) */}
      {!playing && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-red-500/30">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

        <div className="relative p-3 sm:p-4 space-y-2">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress" onClick={handleSeek}>
            <div className="h-full bg-red-500 rounded-full relative transition-all" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 border-2 border-white opacity-0 group-hover/progress:opacity-100 transition" />
            </div>
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="p-1.5 text-white hover:text-red-400 transition">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              {/* Mute */}
              <button onClick={() => { const v = videoRef.current; if (v) { v.muted = !muted; setMuted(!muted); }}} className="p-1.5 text-white hover:text-red-400 transition">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Time */}
              <span className="text-xs text-gray-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Speed */}
              <div className="relative">
                <button onClick={() => setShowSpeed(!showSpeed)} className="p-1.5 text-white hover:text-red-400 transition flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  <span className="text-[10px] font-medium">{speed}x</span>
                </button>
                {showSpeed && (
                  <div className="absolute bottom-full right-0 mb-2 p-1 rounded-lg bg-gray-900/95 border border-white/10 shadow-xl">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`block w-full px-3 py-1.5 text-xs text-left rounded transition ${
                          s === speed ? "bg-red-500/20 text-red-400" : "text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PiP */}
              <button onClick={togglePiP} className="p-1.5 text-white hover:text-red-400 transition hidden sm:block">
                <PictureInPicture2 className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="p-1.5 text-white hover:text-red-400 transition">
                {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className={`absolute top-3 left-3 text-[9px] text-white/30 hidden sm:block pointer-events-none transition-opacity ${showControls ? "opacity-100" : "opacity-0"}`}>
        Space: Play/Pause • F: Fullscreen • M: Mute • ←→: Skip 10s • P: PiP
      </div>
    </div>
  );
}
