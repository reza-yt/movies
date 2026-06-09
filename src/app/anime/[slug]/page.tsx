import { getAnimeDetail } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Info, Play, Star, Tv } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const anime = await getAnimeDetail(slug);

  if (!anime) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <Link href="/anime" className="text-red-400 hover:text-red-300 text-sm">
        ← Kembali ke Anime
      </Link>

      {/* Anime Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <div className="flex-shrink-0 w-48 mx-auto md:mx-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={anime.thumbnail}
              alt={anime.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{anime.title}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {anime.info.status && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                <Star className="w-3 h-3" /> {anime.info.status}
              </span>
            )}
            {anime.info.tipe && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                <Tv className="w-3 h-3" /> {anime.info.tipe}
              </span>
            )}
            {anime.info.season && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                <Calendar className="w-3 h-3" /> {anime.info.season}
              </span>
            )}
            {anime.info.durasi && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">
                <Info className="w-3 h-3" /> {anime.info.durasi}
              </span>
            )}
          </div>

          {/* Genres */}
          {anime.info.genres && (
            <div className="flex flex-wrap gap-1.5">
              {anime.info.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-1 rounded-md bg-white/5 text-gray-400 text-xs border border-white/10"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {anime.synopsis && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">{anime.synopsis}</p>
          )}

          {/* Studio */}
          {anime.info.studio && (
            <p className="text-xs text-gray-500">Studio: {anime.info.studio}</p>
          )}
        </div>
      </div>

      {/* Episodes */}
      {anime.episodes && anime.episodes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" />
            Episodes ({anime.episodes.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
            {anime.episodes.map((ep) => (
              <Link
                key={ep.slug}
                href={`/watch/anime/${ep.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition">
                  <Play className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition">
                    Episode {ep.number}
                  </p>
                  <p className="text-xs text-gray-500">{ep.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
