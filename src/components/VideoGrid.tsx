import { Video } from "@/lib/api";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  source: string;
}

export default function VideoGrid({ videos, source }: VideoGridProps) {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {videos.map((video, index) => (
        <VideoCard key={video.id || index} video={video} source={source} />
      ))}
    </div>
  );
}
