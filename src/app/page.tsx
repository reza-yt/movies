import { getAnimeHome, getAdultVideos, getBiliTVDramas } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import ContinueWatching from "@/components/ContinueWatching";
import Link from "next/link";
import { Play, Zap, Film, Flame, Tv } from "lucide-react";

export default async function HomePage() {
  const [animeData, adultData, dramaData] = await Promise.all([
    getAnimeHome(1),
    getAdultVideos(1),
    getBiliTVDramas(1),
  ]);

  const animeList = animeData?.anime?.slice(0, 12) || [];
  const adultList = adultData?.videos?.slice(0, 12) || [];
  const dramaList = dramaData?.dramas?.slice(0, 12) || [];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Continue Watching */}
      <ContinueWatching />

      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 text-center overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-white/5">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-red-500/5 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 px-4">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium text-yellow-400/80">Free Streaming</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black gradient-text leading-tight">
            StreamBro
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-400 text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
            Nonton anime sub indo & video gratis dari berbagai sumber
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm sm:text-base transition-all hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
            >
              <Film className="w-4 h-4" />
              Anime
            </Link>
            <Link
              href="/drama"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-95"
            >
              <Tv className="w-4 h-4" />
              Drama
            </Link>
            <Link
              href="/adult"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-95"
            >
              <Flame className="w-4 h-4" />
              18+
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-95"
            >
              <Play className="w-4 h-4" />
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Anime */}
      {animeList.length > 0 && (
        <section>
          <SectionHeader title="Anime Terbaru" subtitle="Update terbaru sub Indonesia" href="/anime" />
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
        </section>
      )}

      {/* Drama */}
      {dramaList.length > 0 && (
        <section>
          <SectionHeader title="Drama Populer" subtitle="BiliTV & CashDrama" href="/drama" />
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
            {dramaList.map((drama) => (
              <VideoCard
                key={drama.id}
                title={drama.title}
                thumbnail={drama.cover}
                slug={String(drama.id)}
                href={`/drama/bilitv/${drama.id}`}
                episode={`${drama.episodes} Ep`}
                badge="Drama"
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest 18+ */}
      {adultList.length > 0 && (
        <section>
          <SectionHeader title="18+ Terbaru" subtitle="Konten dewasa terbaru" href="/adult" />
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
            {adultList.map((video) => (
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
        </section>
      )}
    </div>
  );
}
