import { getAnimeHome } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Flame, Download, Calendar, BookOpen } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "Anime - StreamBro",
  description: "Nonton anime subtitle Indonesia terbaru",
};

export default async function AnimePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const data = await getAnimeHome(currentPage);
  const animeList = data?.anime || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Flame className="w-8 h-8 text-red-500" />
            Anime
          </h1>
          <p className="text-gray-500 mt-1">Anime terbaru subtitle Indonesia</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/anime/batch"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm font-medium transition"
          >
            <Download className="w-4 h-4" /> Batch
          </Link>
          <Link
            href="/anime/genres"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm font-medium transition"
          >
            <BookOpen className="w-4 h-4" /> Genres
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm font-medium transition"
          >
            <Calendar className="w-4 h-4" /> Jadwal
          </Link>
        </div>
      </div>

      {/* Grid */}
      {animeList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
          {animeList.map((anime) => (
            <VideoCard
              key={anime.slug}
              title={anime.title}
              thumbnail={anime.thumbnail || anime.image || ""}
              slug={anime.slug}
              href={`/anime/${anime.slug}`}
              type={anime.type}
              episode={anime.latest_episode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No anime found</div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/anime" />
    </div>
  );
}
