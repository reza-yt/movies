import { getAnimeBatch } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import { Download } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "Anime Batch - StreamBro",
};

export default async function AnimeBatchPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const data = await getAnimeBatch(currentPage);
  const animeList = data?.anime || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/anime" className="text-red-400 hover:text-red-300 text-sm mb-2 inline-block">
          ← Kembali ke Anime
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Download className="w-8 h-8 text-green-500" />
          Anime Batch
        </h1>
        <p className="text-gray-500 mt-1">Anime yang sudah completed</p>
      </div>

      {animeList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
          {animeList.map((anime) => (
            <VideoCard
              key={anime.slug}
              title={anime.title}
              thumbnail={anime.image || anime.thumbnail || ""}
              slug={anime.slug}
              href={`/anime/${anime.slug}`}
              type={anime.type}
              badge={anime.status}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No batch anime found</div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/anime/batch" />
    </div>
  );
}
