"use client";

import { useState } from "react";
import { StreamingLink } from "@/lib/api";

interface VideoPlayerProps {
  links: StreamingLink[];
  title: string;
}

export default function VideoPlayer({ links, title }: VideoPlayerProps) {
  const [activeLink, setActiveLink] = useState(0);
  const currentLink = links[activeLink];

  if (!currentLink) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No streaming link available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={currentLink.url}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Server/Quality Selector */}
      {links.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLink(idx)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                idx === activeLink
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {link.server || link.quality || `Server ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
