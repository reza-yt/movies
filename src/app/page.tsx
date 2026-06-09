import { getLatestVideos } from "@/lib/api";
import VideoGrid from "@/components/VideoGrid";
import Link from "next/link";
import { sources } from "@/lib/sources";
import { ChevronRight } from "lucide-react";

// Featured sources to show on homepage
const featuredSources = ["movie", "reelshort", "dramabox", "anime", "drama-korea", "flextv", "shortmax", "dramanova"];

export default async function HomePage() {
  const results = await Promise.all(
    featuredSources.map(async (sourceId) => {
      const data = await getLatestVideos(sourceId, 1);
      const source = sources.find((s) => s.id === sourceId);
      return {
        sourceId,
        sourceName: source?.name || sourceId,
        videos: Array.isArray(data?.data) ? data.data.slice(0, 6) : [],
      };
    })
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          StreamFlix
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          Watch free movies, dramas, anime & short videos from 50+ sources
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/sources"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition"
          >
            Browse Sources
          </Link>
          <Link
            href="/search"
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition"
          >
            Search Videos
          </Link>
        </div>
      </section>

      {/* Video sections by source */}
      {results.map(
        ({ sourceId, sourceName, videos }) =>
          videos.length > 0 && (
            <section key={sourceId}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{sourceName}</h2>
                <Link
                  href={`/source/${sourceId}`}
                  className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <VideoGrid videos={videos} source={sourceId} />
            </section>
          )
      )}
    </div>
  );
}
