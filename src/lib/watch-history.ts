"use client";

export interface WatchHistoryItem {
  id: string; // unique key: source/slug or source/id/ep
  source: string; // anime, adult, bilitv, cashdrama, dramabox
  title: string;
  thumbnail: string;
  href: string; // link to watch page
  episode?: string;
  progress?: number; // 0-100 percent watched
  watchedAt: number; // timestamp
}

const STORAGE_KEY = "streambro_watch_history";
const MAX_HISTORY = 100;

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as WatchHistoryItem[];
  } catch {
    return [];
  }
}

export function addToHistory(item: Omit<WatchHistoryItem, "watchedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    // Remove existing entry with same id
    const filtered = history.filter((h) => h.id !== item.id);
    // Add to front
    filtered.unshift({ ...item, watchedAt: Date.now() });
    // Limit size
    const trimmed = filtered.slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function updateProgress(id: string, progress: number): void {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    const item = history.find((h) => h.id === id);
    if (item) {
      item.progress = Math.round(progress);
      item.watchedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch {}
}

export function removeFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory().filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getContinueWatching(): WatchHistoryItem[] {
  const history = getWatchHistory();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return history
    .filter((h) => h.watchedAt > weekAgo)
    .slice(0, 12);
}
