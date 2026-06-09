import { getAnimeGenres } from "@/lib/api";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Anime Genres - StreamFlix",
};

export default async function AnimeGenresPage() {
  const genres = await getAnimeGenres();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/anime" className="text-red-400 hover:text-red-300 text-sm mb-2 inline-block">
          ← Kembali ke Anime
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-500" />
          Anime Genres
        </h1>
        <p className="text-gray-500 mt-1">{genres?.length || 0} genre tersedia</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 stagger-children">
        {genres?.map((genre) => (
          <Link
            key={genre.slug}
            href={`/anime/genres/${genre.slug}`}
            className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200 card-hover"
          >
            <h3 className="font-medium text-gray-200 group-hover:text-white transition">{genre.name}</h3>
            <span className="text-xs text-gray-500 mt-1 block">{genre.count} anime</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
