import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Video } from "@/lib/api";

interface VideoCardProps {
  video: Video;
  source: string;
}

export default function VideoCard({ video, source }: VideoCardProps) {
  const slug = video.slug || video.id;

  return (
    <Link
      href={`/watch/${source}/${slug}`}
      className="group relative bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={video.thumbnail || "/placeholder.jpg"}
          alt={video.title}
          fill
          className="object-cover group-hover:opacity-75 transition-opacity"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-red-600/90 rounded-full p-3">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        {/* Quality badge */}
        {video.quality && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium">
            {video.quality}
          </span>
        )}
        {/* Episode count */}
        {video.episodes && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium">
            Ep {video.episodes}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
          {video.title}
        </h3>
        {(video.year || video.rating) && (
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            {video.year && <span>{video.year}</span>}
            {video.rating && <span>⭐ {video.rating}</span>}
          </div>
        )}
        <span className="inline-block mt-2 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
          {source}
        </span>
      </div>
    </Link>
  );
}
