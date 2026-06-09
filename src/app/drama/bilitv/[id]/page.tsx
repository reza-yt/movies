import { getBiliTVDramaDetail } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Lock, Unlock } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BiliTVDetailPage({ params }: PageProps) {
  const { id } = await params;
  const drama = await getBiliTVDramaDetail(parseInt(id));

  if (!drama) {
    notFound();
  }

  const freeEpisodes = drama.episodes.filter((ep) => ep.free);
  const lockedEpisodes = drama.episodes.filter((ep) => !ep.free);

  return (
    <div className="space-y-8 animate-fade-up">
      <Link href="/drama/bilitv" className="text-red-400 hover:text-red-300 text-sm">
        ← Kembali ke BiliTV
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Poster */}
        <div className="flex-shrink-0 w-40 mx-auto sm:mx-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={drama.cover}
              alt={drama.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-xl sm:text-2xl font-bold">{drama.title}</h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              BiliTV
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
              {drama.episodes.length} Episode
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {freeEpisodes.length} Gratis
            </span>
          </div>
          {drama.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{drama.description}</p>
          )}
        </div>
      </div>

      {/* Episodes */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-red-500" />
          Daftar Episode
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
          {drama.episodes.map((ep) => (
            <Link
              key={ep.id}
              href={ep.free ? `/drama/bilitv/${id}/watch/${ep.number}` : "#"}
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-sm font-medium transition-all ${
                ep.free
                  ? "bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-gray-200 hover:text-white"
                  : "bg-gray-800/30 border border-gray-700/50 text-gray-600 cursor-not-allowed"
              }`}
            >
              {ep.free ? (
                <Unlock className="w-3 h-3 text-green-400" />
              ) : (
                <Lock className="w-3 h-3 text-gray-600" />
              )}
              {ep.number}
            </Link>
          ))}
        </div>
        {lockedEpisodes.length > 0 && (
          <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
            <Lock className="w-3 h-3" /> {lockedEpisodes.length} episode terkunci
          </p>
        )}
      </div>
    </div>
  );
}
