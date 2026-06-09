"use client";

import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { useState } from "react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  slug: string;
  href: string;
  duration?: string;
  type?: string;
  episode?: string;
  badge?: string;
}

export default function VideoCard({
  title,
  thumbnail,
  href,
  duration,
  type,
  episode,
  badge,
}: VideoCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={href} className="group card-hover block">
      <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800/50 group-hover:border-red-500/30 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgError ? "/placeholder.jpg" : (thumbnail || "/placeholder.jpg")}
            alt={title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <div className="w-14 h-14 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-red-500/30">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              {duration}
            </div>
          )}

          {/* Type badge */}
          {(type || badge) && (
            <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md font-semibold">
              {badge || type}
            </div>
          )}

          {/* Episode badge */}
          {episode && (
            <div className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md font-semibold">
              {episode}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-white transition-colors leading-snug">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
