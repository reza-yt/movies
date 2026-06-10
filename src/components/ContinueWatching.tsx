"use client";

import { useEffect, useState } from "react";
import { getContinueWatching, removeFromHistory, WatchHistoryItem } from "@/lib/watch-history";
import Link from "next/link";
import { Play, X, History } from "lucide-react";

export default function ContinueWatching() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  function handleRemove(id: string) {
    removeFromHistory(id);
    setItems(getContinueWatching());
  }

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          Lanjutkan Nonton
        </h2>
        <Link href="/history" className="text-xs text-red-400 hover:text-red-300 font-medium">
          Lihat Semua →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-36 sm:w-44 group relative">
            <Link href={item.href} className="block">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-10 h-10 rounded-full bg-red-500/90 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
                {item.progress && item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${item.progress}%` }} />
                  </div>
                )}
                <span className="absolute top-1 left-1 bg-black/70 text-[9px] text-gray-300 px-1.5 py-0.5 rounded">
                  {item.source}
                </span>
              </div>
              <div className="mt-1.5 px-0.5">
                <p className="text-xs font-medium text-gray-200 line-clamp-2 leading-tight">{item.title}</p>
                {item.episode && <p className="text-[10px] text-gray-500 mt-0.5">{item.episode}</p>}
              </div>
            </Link>
            <button
              onClick={() => handleRemove(item.id)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
