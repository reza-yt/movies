import { getCashDramaPlay, getCashDramaDetail } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import DramaPlayer from "@/components/DramaPlayer";

interface PageProps {
  params: Promise<{ vid: string; ep: string }>;
}

export default async function CashDramaWatchPage({ params }: PageProps) {
  const { vid, ep } = await params;
  const epNumber = parseInt(ep);

  const [playData, dramaData] = await Promise.all([
    getCashDramaPlay(vid, epNumber),
    getCashDramaDetail(vid),
  ]);

  if (!playData || !playData.adaptive || playData.adaptive.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <Monitor className="w-12 h-12 text-gray-600 mx-auto" />
        <p className="text-gray-400 text-lg">Episode tidak tersedia</p>
        <Link href={`/drama/cashdrama/${vid}`} className="text-red-400 hover:text-red-300">
          ← Kembali ke detail drama
        </Link>
      </div>
    );
  }

  const qualities = playData.adaptive.map((stream) => ({
    label: `${stream.height}p`,
    url: stream.url,
  }));

  const dramaTitle = dramaData?.info?.name || "Drama";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <Link href={`/drama/cashdrama/${vid}`} className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> {dramaTitle}
      </Link>

      <h1 className="text-lg sm:text-xl font-bold">
        {dramaTitle} - Episode {epNumber}
      </h1>

      {/* Player */}
      <DramaPlayer qualities={qualities} title={`Episode ${epNumber}`} />

      {/* Episode Navigation */}
      {dramaData && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Episode Lainnya</h3>
          <div className="flex flex-wrap gap-2">
            {dramaData.episodes.slice(0, parseInt(dramaData.info.freeCount || "3")).map((e) => (
              <Link
                key={e.ep}
                href={`/drama/cashdrama/${vid}/watch/${e.ep}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                  parseInt(e.ep) === epNumber
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                {e.ep}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
