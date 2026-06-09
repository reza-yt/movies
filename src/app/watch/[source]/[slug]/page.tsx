import { getVideoDetail } from "@/lib/api";
import { getSourceById } from "@/lib/sources";
import { notFound } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";

interface PageProps {
  params: Promise<{ source: string; slug: string }>;
}

export default async function WatchPage({ params }: PageProps) {
  const { source: sourceSlug, slug } = await params;
  const source = getSourceById(sourceSlug);

  if (!source) {
    notFound();
  }

  const data = await getVideoDetail(source.id, slug);
  const video = data?.data;

  if (!video) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
        <p className="text-gray-400 mb-4">Could not load video details</p>
        <Link href={`/source/${sourceSlug}`} className="text-red-400 hover:text-red-300">
          ← Back to {source.name}
        </Link>
      </div>
    );
  }

  // Get streaming links from video or first episode
  const streamingLinks =
    video.streaming_links ||
    (video.episodes && video.episodes.length > 0 ? video.episodes[0].streaming_links : []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Link href={`/source/${sourceSlug}`} className="text-red-400 hover:text-red-300 text-sm">
        ← Back to {source.name}
      </Link>

      {/* Video Player */}
      <div className="mt-4">
        {streamingLinks && streamingLinks.length > 0 ? (
          <VideoPlayer links={streamingLinks} title={video.title} />
        ) : (
          <div className="relative aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover rounded-lg opacity-50"
                unoptimized
              />
            ) : null}
            <p className="relative z-10 text-gray-400 text-lg">No streaming link available</p>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="mt-6">
        <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400">
          {video.year && <span className="bg-gray-800 px-2.5 py-1 rounded">{video.year}</span>}
          {video.quality && <span className="bg-red-600/20 text-red-400 px-2.5 py-1 rounded">{video.quality}</span>}
          {video.rating && <span>⭐ {video.rating}</span>}
          {video.duration && <span>⏱ {video.duration}</span>}
          {video.views && <span>👁 {video.views}</span>}
          <span className="bg-gray-800 px-2.5 py-1 rounded">{source.name}</span>
        </div>

        {video.description && (
          <p className="mt-4 text-gray-300 leading-relaxed">{video.description}</p>
        )}
      </div>

      {/* Episodes */}
      {video.episodes && video.episodes.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Episodes ({video.episodes.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {video.episodes.map((ep, idx) => (
              <Link
                key={ep.id || idx}
                href={`/watch/${sourceSlug}/${slug}?ep=${idx}`}
                className="px-3 py-2 bg-gray-800 hover:bg-red-600 rounded-lg text-sm text-center transition"
              >
                {ep.title || `Episode ${ep.episode_number || idx + 1}`}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
