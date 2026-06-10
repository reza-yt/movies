"use client";

export interface Comment {
  id: string;
  videoId: string;
  username: string;
  text: string;
  rating: number; // 1-5
  createdAt: number;
}

const STORAGE_KEY = "streambro_comments";

export function getComments(videoId: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const all: Comment[] = JSON.parse(data);
    return all.filter((c) => c.videoId === videoId).sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function addComment(comment: Omit<Comment, "id" | "createdAt">): Comment {
  const newComment: Comment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  if (typeof window === "undefined") return newComment;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const all: Comment[] = data ? JSON.parse(data) : [];
    all.unshift(newComment);
    // Max 500 comments total
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 500)));
  } catch {}
  return newComment;
}

export function deleteComment(commentId: string): void {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    const all: Comment[] = JSON.parse(data);
    const filtered = all.filter((c) => c.id !== commentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}

export function getAverageRating(videoId: string): { average: number; count: number } {
  const comments = getComments(videoId);
  const rated = comments.filter((c) => c.rating > 0);
  if (rated.length === 0) return { average: 0, count: 0 };
  const sum = rated.reduce((acc, c) => acc + c.rating, 0);
  return { average: Math.round((sum / rated.length) * 10) / 10, count: rated.length };
}
