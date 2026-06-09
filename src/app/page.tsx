import { getAnimeHome, getAdultVideos } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { Play, Zap, Film, Flame } from "lucide-react";

export default async function HomePage() {
  const [animeData, adultData] = await Promise.all([
    getAnimeHome(1),
    getAdultVideos(1),
  ]);

  const animeList = animeData?.anime?.slice(0, 12) || [];
  const adultList = adultData?.slice(0, 12) || [];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-16 text-center overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-white/5">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400/80">Free Streaming</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black gradient-text leading-tight">
            StreamFlix
          </h1>
          <p className="mt-4 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            Nonton anime sub indo & video gratis dari berbagai sumber
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
            >
              <Film className="w-4 h-4" />
              Anime
            </Link>
            <Link
              href="/adult"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
            >
              <Flame className="w-4 h-4" />
              18+
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 stagger-children">
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

      {/* Latest 18+ */}
      {adultList.length > 0 && (
        <section>
          <SectionHeader title="18+ Terbaru" subtitle="Konten dewasa terbaru" href="/adult" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 stagger-children">
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
