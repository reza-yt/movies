import { getBiliTVDramas, getCashDramaHome } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { Tv, Clapperboard } from "lucide-react";

export const metadata = {
  title: "Drama - StreamBro",
  description: "Nonton drama pendek gratis dari BiliTV dan CashDrama",
};

export default async function DramaPage() {
  const [biliData, cashData] = await Promise.all([
    getBiliTVDramas(1),
    getCashDramaHome(),
  ]);

  const biliDramas = biliData?.dramas || [];
  const cashDramas = cashData || [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Tv className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
            Drama
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Drama pendek dari BiliTV & CashDrama</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/drama/bilitv"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm font-medium transition active:scale-95"
          >
            <Clapperboard className="w-4 h-4" /> BiliTV
          </Link>
          <Link
            href="/drama/cashdrama"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm font-medium transition active:scale-95"
          >
            <Tv className="w-4 h-4" /> CashDrama
          </Link>
        </div>
      </div>

      {/* BiliTV Section */}
      {biliDramas.length > 0 && (
        <section>
          <SectionHeader title="BiliTV" subtitle="Drama pendek populer" href="/drama/bilitv" />
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
            {biliDramas.slice(0, 12).map((drama) => (
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
        </section>
      )}

      {/* CashDrama Section */}
      {cashDramas.length > 0 && (
        <section>
          <SectionHeader title="CashDrama" subtitle="Drama terbaru dengan subtitle" href="/drama/cashdrama" />
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
            {cashDramas.slice(0, 12).map((drama) => (
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
        </section>
      )}
    </div>
  );
}
