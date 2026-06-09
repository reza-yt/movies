"use client";

import { useState } from "react";
import { Monitor, Play } from "lucide-react";

interface Quality {
  label: string;
  url: string;
}

interface DramaPlayerProps {
  qualities: Quality[];
  title: string;
}

export default function DramaPlayer({ qualities, title }: DramaPlayerProps) {
  const [activeQuality, setActiveQuality] = useState(0);

  if (!qualities || qualities.length === 0) {
    return (
      <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Tidak ada stream tersedia</p>
        </div>
      </div>
    );
  }

  const current = qualities[activeQuality];

  return (
    <div className="space-y-4">
      {/* Player */}
      <div className="relative aspect-[9/16] sm:aspect-video max-h-[80vh] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50 mx-auto">
        <video
          key={current.url}
          src={current.url}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
          title={title}
        />
      </div>

      {/* Quality selector */}
      {qualities.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400 flex items-center gap-1.5 mr-1">
            <Play className="w-4 h-4" />
            Kualitas:
          </span>
          {qualities.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQuality(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                idx === activeQuality
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
