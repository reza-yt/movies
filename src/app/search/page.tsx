"use client";

import { Suspense, useState, useEffect } from "react";
import { Search, Film, Flame } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import CinemaLoader from "@/components/CinemaLoader";
import { useSearchParams } from "next/navigation";

type SearchSource = "anime" | "adult";

interface SearchResult {
  title: string;
  slug: string;
  thumbnail?: string;
  image?: string;
  duration?: string;
  type?: string;
  latest_episode?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [source, setSource] = useState<SearchSource>("anime");
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

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-gray-500 mt-1">Cari anime atau video</p>
      </div>

      {/* Search form */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Source toggle */}
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setSource("anime")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              source === "anime" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Film className="w-4 h-4" /> Anime
          </button>
          <button
            onClick={() => setSource("adult")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              source === "adult" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" /> 18+
          </button>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-1 gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={source === "anime" ? "Cari anime..." : "Cari video..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-500/25"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <CinemaLoader text="Mencari..." />
      ) : searched && results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 stagger-children">
          {results.map((item) => (
            <VideoCard
              key={item.slug}
              title={item.title}
              thumbnail={item.thumbnail || item.image || ""}
              slug={item.slug}
              href={source === "anime" ? `/anime/${item.slug}` : `/watch/adult/${item.slug}`}
              duration={item.duration}
              type={item.type}
              episode={item.latest_episode}
              badge={source === "adult" ? "18+" : undefined}
            />
          ))}
        </div>
      ) : searched ? (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Ketik judul untuk mencari</p>
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
