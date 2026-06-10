"use client";

import { useEffect, useState } from "react";
import { getWatchHistory, removeFromHistory, clearHistory, WatchHistoryItem } from "@/lib/watch-history";
import Link from "next/link";
import { History, Trash2, X, Clock } from "lucide-react";

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}h lalu`;
  return `${Math.floor(days / 7)}mg lalu`;
}

export default function HistoryPage() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    setItems(getWatchHistory());
  }, []);

  function handleRemove(id: string) {
    removeFromHistory(id);
    setItems(getWatchHistory());
  }

  function handleClear() {
    clearHistory();
    setItems([]);
    setShowClear(false);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" />
            Riwayat Tontonan
          </h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} video ditonton</p>
        </div>
        {items.length > 0 && (
          showClear ? (
            <div className="flex items-center gap-2">
              <button onClick={handleClear} className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium">
                Hapus Semua
              </button>
              <button onClick={() => setShowClear(false)} className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs rounded-lg">
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClear(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:border-red-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition">
              <Link href={item.href} className="flex-shrink-0 w-16 h-20 relative rounded-lg overflow-hidden bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {item.progress && item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
                    <div className="h-full bg-red-500" style={{ width: `${item.progress}%` }} />
                  </div>
                )}
              </Link>
              <Link href={item.href} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 line-clamp-1 group-hover:text-white transition">{item.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="px-1.5 py-0.5 rounded bg-white/5">{item.source}</span>
                  {item.episode && <span>{item.episode}</span>}
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.watchedAt)}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(item.id)}
                className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada riwayat tontonan</p>
          <p className="text-xs mt-1">Video yang kamu tonton akan muncul di sini</p>
        </div>
      )}
    </div>
  );
}
