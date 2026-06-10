"use client";

import { useState } from "react";
import { Monitor } from "lucide-react";
import { AnimeStreamingServer } from "@/lib/api";
import EnhancedPlayer from "./EnhancedPlayer";

interface VideoPlayerProps {
  servers: AnimeStreamingServer[];
  title: string;
}

export default function VideoPlayer({ servers, title }: VideoPlayerProps) {
  const validServers = servers.filter(
    (s) => s.url && s.url.startsWith("http") && s.type === "embed"
  );
  const [activeServer, setActiveServer] = useState(0);

  if (!validServers.length) {
    return (
      <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No streaming server available</p>
        </div>
      </div>
    );
  }

  const current = validServers[activeServer];

  return (
    <div className="space-y-4">
      {/* Player */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50">
        <iframe
          src={current.url}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Server selector */}
      {validServers.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400 flex items-center gap-1.5 mr-2">
            <Monitor className="w-4 h-4" />
            Server:
          </span>
          {validServers.map((server, idx) => (
            <button
              key={idx}
              onClick={() => setActiveServer(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                idx === activeServer
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {server.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// HLS Player for 18+ content (m3u8) - uses EnhancedPlayer
export function HLSPlayer({ url, title }: { url: string; title: string }) {
  return <EnhancedPlayer src={url} title={title} />;
}
