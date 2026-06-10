"use client";

import { useState, useEffect } from "react";
import { getComments, addComment, deleteComment, getAverageRating, Comment } from "@/lib/ratings";
import { Star, Send, Trash2, MessageCircle, User } from "lucide-react";

interface CommentSectionProps {
  videoId: string; // unique identifier like "anime/slug" or "dramabox/bookId/ep"
}

function StarRating({ rating, onRate, size = "md" }: { rating: number; onRate?: (r: number) => void; size?: "sm" | "md" }) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onRate}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onRate && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`transition ${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`${starSize} ${
              star <= (hovered || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [avgRating, setAvgRating] = useState({ average: 0, count: 0 });
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setComments(getComments(videoId));
    setAvgRating(getAverageRating(videoId));
    // Load saved username
    const saved = localStorage.getItem("streambro_username");
    if (saved) setUsername(saved);
  }, [videoId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !username.trim()) return;

    // Save username for next time
    localStorage.setItem("streambro_username", username);

    addComment({
      videoId,
      username: username.trim(),
      text: text.trim(),
      rating,
    });

    setText("");
    setRating(0);
    setShowForm(false);
    setComments(getComments(videoId));
    setAvgRating(getAverageRating(videoId));
  }

  function handleDelete(commentId: string) {
    deleteComment(commentId);
    setComments(getComments(videoId));
    setAvgRating(getAverageRating(videoId));
  }

  function formatTime(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins}m lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}j lalu`;
    const days = Math.floor(hrs / 24);
    return `${days}h lalu`;
  }

  return (
    <div className="space-y-4 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-400" />
          Komentar ({comments.length})
        </h3>

        {/* Average Rating */}
        {avgRating.count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <StarRating rating={Math.round(avgRating.average)} size="sm" />
            <span className="text-yellow-400 font-medium">{avgRating.average}</span>
            <span className="text-gray-600 text-xs">({avgRating.count})</span>
          </div>
        )}
      </div>

      {/* Add Comment Button / Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left text-sm text-gray-500 hover:border-white/20 transition"
        >
          Tulis komentar...
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nama kamu"
            required
            maxLength={30}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
          />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Rating:</span>
            <StarRating rating={rating} onRate={setRating} />
            {rating > 0 && (
              <button type="button" onClick={() => setRating(0)} className="text-xs text-gray-600 hover:text-gray-400">
                Reset
              </button>
            )}
          </div>

          {/* Comment text */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis komentar kamu..."
            required
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> Kirim
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white transition"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-200">{comment.username}</span>
                    <span className="text-[10px] text-gray-600 ml-2">{formatTime(comment.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {comment.rating > 0 && <StarRating rating={comment.rating} size="sm" />}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 rounded text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-2 ml-9 leading-relaxed">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <p className="text-center text-xs text-gray-600 py-4">Belum ada komentar. Jadilah yang pertama!</p>
        )
      )}
    </div>
  );
}
