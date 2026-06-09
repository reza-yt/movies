import { getCashDramaHome, getCashDramaTags } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { Tv, Tag } from "lucide-react";

export const metadata = {
  title: "CashDrama - StreamBro",
};

export default async function CashDramaPage() {
  const [dramas, tags] = await Promise.all([
    getCashDramaHome(),
    getCashDramaTags(),
  ]);

  const dramaList = dramas || [];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/drama" className="text-red-400 hover:text-red-300 text-sm mb-2 inline-block">
          ← Kembali ke Drama
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Tv className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
          CashDrama
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Drama pendek dengan subtitle Indonesia</p>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 20).map((tag) => (
              <span
                key={tag.tagId}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs font-medium border border-white/10"
              >
                {tag.tagName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dramas */}
      {dramaList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
          {dramaList.map((drama) => (
            <VideoCard
              key={drama.id}
              title={drama.name}
              thumbnail={drama.cover}
              slug={drama.id}
              href={`/drama/cashdrama/${drama.id}`}
              episode={`${drama.episodes} Ep`}
              badge="CashDrama"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Tidak ada drama</div>
      )}
    </div>
  );
}
