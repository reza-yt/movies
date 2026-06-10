import { getAdultVideoDetail } from "@/lib/api";
import { HLSPlayer } from "@/components/VideoPlayer";
import VideoCard from "@/components/VideoCard";
import WatchTracker from "@/components/WatchTracker";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WatchAdultPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getAdultVideoDetail(slug);

  if (!data) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400 text-lg">Video tidak ditemukan</p>
        <Link href="/adult" className="text-red-400 hover:text-red-300">← Kembali ke 18+</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <Link href="/adult" className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke 18+
      </Link>

      <h1 className="text-xl md:text-2xl font-bold">{data.title}</h1>

      {/* Track watch history */}
      <WatchTracker item={{
        id: `adult/${slug}`,
        source: "18+",
        title: data.title,
        thumbnail: "",
        href: `/watch/adult/${slug}`,
      }} />

      {/* Player */}
      <HLSPlayer url={data.m3u8_url} title={data.title} />

      {/* Info */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
        {data.duration && (
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
            ⏱ {data.duration}
          </span>
        )}
      </div>

      {/* Categories */}
      {data.categories && data.categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          {data.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/adult/category/${cat.slug}`}
              className="px-2.5 py-1 rounded-md bg-white/5 text-gray-400 text-xs border border-white/10 hover:bg-pink-500/10 hover:text-pink-300 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Related Videos */}
      {data.related_videos && data.related_videos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">Video Terkait</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.related_videos.map((video) => (
              <VideoCard
                key={video.slug}
                title={video.title}
                thumbnail={video.thumbnail}
                slug={video.slug}
                href={`/watch/adult/${video.slug}`}
                duration={video.duration}
                badge="18+"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
