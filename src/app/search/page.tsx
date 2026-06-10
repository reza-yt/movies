"use client";

import { Suspense, useState, useEffect } from "react";
import { Search, Film, Flame, Tv, TrendingUp } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import CinemaLoader from "@/components/CinemaLoader";
import { useSearchParams } from "next/navigation";

type SearchSource = "anime" | "adult" | "bilitv" | "cashdrama";

interface SearchResult {
  title: string;
  slug: string;
  thumbnail?: string;
  image?: string;
  duration?: string;
  type?: string;
  latest_episode?: string;
}

// Popular search suggestions per source
const popularSearches: Record<SearchSource, string[]> = {
  anime: ["Naruto", "One Piece", "Jujutsu Kaisen", "Solo Leveling", "Demon Slayer", "Dragon Ball", "Attack on Titan", "Bleach", "My Hero Academia", "Spy x Family"],
  adult: ["bokep indo terbaru", "bokep indo viral", "jepang", "korea", "barat", "hijab", "cantik", "viral tiktok", "abg", "mama muda"],
  bilitv: ["cinta", "CEO", "balas dendam", "kuno", "romantis", "pewaris", "misteri"],
  cashdrama: ["cinta", "balas dendam", "keluarga", "CEO", "reinkarnasi", "sekolah"],
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialSource = (searchParams.get("source") as SearchSource) || "anime";
  const [query, setQuery] = useState(initialQuery);
  const [source, setSource] = useState<SearchSource>(initialSource);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  async function handleSearch(searchQuery?: string) {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setQuery(q);
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?source=${source}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  function handleTagClick(tag: string) {
    setQuery(tag);
    handleSearch(tag);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Search</h1>
        <p className="text-gray-500 mt-1 text-sm">Cari anime, drama, atau video</p>
      </div>

      {/* Search form */}
      <div className="flex flex-col gap-3">
        {/* Source toggle */}
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSource("anime")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              source === "anime" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Anime
          </button>
          <button
            onClick={() => setSource("bilitv")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              source === "bilitv" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> BiliTV
          </button>
          <button
            onClick={() => setSource("cashdrama")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              source === "cashdrama" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> CashDrama
          </button>
          <button
            onClick={() => setSource("adult")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              source === "adult" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> 18+
          </button>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={
                source === "anime" ? "Cari anime... (contoh: Naruto)" :
                source === "adult" ? "Cari video... (contoh: bokep indo viral)" :
                "Cari drama..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          <button
            type="submit"
            className="px-5 sm:px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
          >
            Cari
          </button>
        </form>

        {/* Popular searches / quick tags */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Populer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularSearches[source].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                  query === tag
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <CinemaLoader text="Mencari..." />
      ) : searched && results.length > 0 ? (
        <>
          <p className="text-sm text-gray-500">{results.length} hasil ditemukan untuk &ldquo;{query}&rdquo;</p>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
            {results.map((item) => (
              <VideoCard
                key={item.slug}
                title={item.title}
                thumbnail={item.thumbnail || item.image || ""}
                slug={item.slug}
                href={
                  source === "anime" ? `/anime/${item.slug}` :
                  source === "bilitv" ? `/drama/bilitv/${item.slug}` :
                  source === "cashdrama" ? `/drama/cashdrama/${item.slug}` :
                  `/watch/adult/${item.slug}`
                }
                duration={item.duration}
                type={item.type}
                episode={item.latest_episode}
                badge={source === "adult" ? "18+" : source === "bilitv" ? "BiliTV" : source === "cashdrama" ? "CashDrama" : undefined}
              />
            ))}
          </div>
        </>
      ) : searched ? (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
          <p className="text-xs mt-2 text-gray-600">Coba kata kunci lain atau pilih source berbeda</p>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Ketik judul atau klik tag populer di atas</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<CinemaLoader text="Loading..." />}>
      <SearchContent />
    </Suspense>
  );
}
