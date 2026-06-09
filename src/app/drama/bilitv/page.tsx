import { getBiliTVDramas } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Clapperboard } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "BiliTV - StreamBro",
};

export default async function BiliTVPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const data = await getBiliTVDramas(currentPage);
  const dramas = data?.dramas || [];
  const totalPages = data ? Math.ceil(data.total / 10) : 1;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/drama" className="text-red-400 hover:text-red-300 text-sm mb-2 inline-block">
          ← Kembali ke Drama
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Clapperboard className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
          BiliTV
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{data?.total || 0} drama tersedia</p>
      </div>

      {dramas.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
          {dramas.map((drama) => (
            <VideoCard
              key={drama.id}
              title={drama.title}
              thumbnail={drama.cover}
              slug={String(drama.id)}
              href={`/drama/bilitv/${drama.id}`}
              episode={`${drama.episodes} Ep`}
              badge="BiliTV"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Tidak ada drama</div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/drama/bilitv" />
    </div>
  );
}
