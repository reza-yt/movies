import { getAdultVideos, getAdultCategories } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Flame, Grid } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "18+ - StreamBro",
  description: "Konten dewasa streaming",
};

export default async function AdultPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const [videos, categories] = await Promise.all([
    getAdultVideos(currentPage),
    getAdultCategories(),
  ]);

  const videoList = videos || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Flame className="w-8 h-8 text-pink-500" />
          18+ Content
        </h1>
        <p className="text-gray-500 mt-1">Konten khusus dewasa</p>
      </div>

      {/* Categories row */}
      {categories && categories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Grid className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Kategori Populer</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 30).map((cat) => (
              <Link
                key={cat.slug}
                href={`/adult/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs font-medium border border-white/10 hover:bg-pink-500/10 hover:border-pink-500/20 hover:text-pink-300 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videoList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
          {videoList.map((video) => (
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
      ) : (
        <div className="text-center py-20 text-gray-500">Tidak ada video</div>
      )}

      <Pagination currentPage={currentPage} hasMore={videoList.length >= 10} baseUrl="/adult" />
    </div>
  );
}
