import { getDramaBoxDetail } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import DramaPlayer from "@/components/DramaPlayer";
import DownloadButton from "@/components/DownloadButton";
import WatchTracker from "@/components/WatchTracker";

interface PageProps {
  params: Promise<{ bookId: string; episode: string }>;
}

export default async function DramaBoxWatchPage({ params }: PageProps) {
  const { bookId, episode } = await params;
  const epNumber = parseInt(episode);

  const drama = await getDramaBoxDetail(bookId);

  if (!drama) {
    return (
      <div className="text-center py-20 space-y-4">
        <Monitor className="w-12 h-12 text-gray-600 mx-auto" />
        <p className="text-gray-400 text-lg">Drama tidak ditemukan</p>
        <Link href="/drama/dramabox" className="text-red-400 hover:text-red-300">← Kembali ke DramaBox</Link>
      </div>
    );
  }

  const currentEp = drama.episodes.find((ep) => ep.episode === epNumber);

  if (!currentEp || !currentEp.url) {
    return (
      <div className="text-center py-20 space-y-4">
        <Monitor className="w-12 h-12 text-gray-600 mx-auto" />
        <p className="text-gray-400 text-lg">Episode tidak tersedia</p>
        <Link href={`/drama/dramabox/${bookId}`} className="text-red-400 hover:text-red-300">← Kembali</Link>
      </div>
    );
  }

  // Build quality options from the URL (DramaBox provides direct URL)
  const qualities = [{ label: `${currentEp.quality}p`, url: currentEp.url }];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <Link href={`/drama/dramabox/${bookId}`} className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> {drama.bookName}
      </Link>

      <h1 className="text-lg sm:text-xl font-bold">
        {drama.bookName} - Episode {epNumber}
      </h1>

      {/* Player */}
      <DramaPlayer qualities={qualities} title={`${drama.bookName} - Episode ${epNumber}`} />

      {/* Watch Tracker */}
      <WatchTracker item={{
        id: `dramabox/${bookId}/${epNumber}`,
        source: "DramaBox",
        title: drama.bookName,
        thumbnail: drama.cover,
        href: `/drama/dramabox/${bookId}/watch/${epNumber}`,
        episode: `Episode ${epNumber}`,
      }} />

      {/* Download */}
      <DownloadButton url={currentEp.url} title={`${drama.bookName} - Ep ${epNumber}`} quality={`${currentEp.quality}p`} />

      {/* Subtitle info */}
      {currentEp.subtitles && currentEp.subtitles.length > 0 && (
        <p className="text-xs text-gray-500">
          Subtitle tersedia: {currentEp.subtitles.map((s) => s.lang.toUpperCase()).join(", ")}
        </p>
      )}

      {/* Episode Navigation */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Episode Lainnya</h3>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-hide">
          {drama.episodes.map((ep) => (
            <Link
              key={ep.episode}
              href={`/drama/dramabox/${bookId}/watch/${ep.episode}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                ep.episode === epNumber
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              {ep.episode}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
