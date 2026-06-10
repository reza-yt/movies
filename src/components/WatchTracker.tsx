"use client";

import { useEffect } from "react";
import { addToHistory, WatchHistoryItem } from "@/lib/watch-history";

interface WatchTrackerProps {
  item: Omit<WatchHistoryItem, "watchedAt">;
}

/**
 * Drop this component into any watch page to auto-track history.
 */
export default function WatchTracker({ item }: WatchTrackerProps) {
  useEffect(() => {
    addToHistory(item);
  }, [item.id]);

  return null;
}
