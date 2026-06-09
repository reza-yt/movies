import { getCashDramaDetail } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Info } from "lucide-react";

interface PageProps {
  params: Promise<{ vid: string }>;
}

export default async function CashDramaDetailPage({ params }: PageProps) {
  const { vid } = await params;
  const data = await getCashDramaDetail(vid);

  if (!data) {
    notFound();
  }

  const { info, episodes } = data;
  const freeCount = parseInt(info.freeCount || "0");

  return (
    <div className="space-y-8 animate-fade-up">
      <Link href="/drama/cashdrama" className="text-red-400 hover:text-red-300 text-sm">
        ← Kembali ke CashDrama
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Poster */}
        <div className="flex-shrink-0 w-40 mx-auto sm:mx-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={info.cover}
              alt={info.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-xl sm:text-2xl font-bold">{info.name}</h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              CashDrama
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
              {info.dramaCount} Episode
            </span>
            {freeCount > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {freeCount} Gratis
              </span>
            )}
          </div>
          {info.isDubbing === "1" && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-400">
              <Info className="w-3 h-3" /> Dubbing tersedia
            </div>
          )}
        </div>
      </div>

      {/* Episodes */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-red-500" />
          Daftar Episode ({episodes.length})
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
          {episodes.map((ep, idx) => {
            const isFree = idx < freeCount;
            return (
              <Link
                key={ep.ep}
                href={isFree ? `/drama/cashdrama/${vid}/watch/${ep.ep}` : "#"}
                className={`flex items-center justify-center p-2.5 rounded-xl text-sm font-medium transition-all ${
                  isFree
                    ? "bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-gray-200 hover:text-white"
                    : "bg-gray-800/30 border border-gray-700/50 text-gray-600 cursor-not-allowed"
                }`}
              >
                {ep.ep}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
