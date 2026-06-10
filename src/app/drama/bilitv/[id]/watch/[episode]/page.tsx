import { getBiliTVEpisode, getBiliTVDramaDetail } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import DramaPlayer from "@/components/DramaPlayer";
import WatchTracker from "@/components/WatchTracker";
import CommentSection from "@/components/CommentSection";
import { DownloadLinks } from "@/components/DownloadButton";

interface PageProps {
  params: Promise<{ id: string; episode: string }>;
}

export default async function BiliTVWatchPage({ params }: PageProps) {
  const { id, episode } = await params;
  const dramaId = parseInt(id);
  const epNumber = parseInt(episode);

  const [epData, dramaData] = await Promise.all([
    getBiliTVEpisode(dramaId, epNumber),
    getBiliTVDramaDetail(dramaId),
  ]);

  if (!epData || epData.isLocked) {
    return (
      <div className="text-center py-20 space-y-4">
        <Monitor className="w-12 h-12 text-gray-600 mx-auto" />
        <p className="text-gray-400 text-lg">Episode tidak tersedia atau terkunci</p>
        <Link href={`/drama/bilitv/${id}`} className="text-red-400 hover:text-red-300">
          ← Kembali ke detail drama
        </Link>
      </div>
    );
  }

  // Build quality options
  const qualities = Object.entries(epData.qualities || {}).map(([quality, url]) => ({
    label: `${quality}p`,
    url,
  }));

  // Add default video as fallback
  if (epData.video && !qualities.find((q) => q.url === epData.video)) {
    qualities.unshift({ label: "Default", url: epData.video });
  }

  // Download links
  const downloadLinks = qualities.map((q) => ({ label: `Download ${q.label}`, url: q.url }));

  const dramaTitle = dramaData?.title || "Drama";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <Link href={`/drama/bilitv/${id}`} className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> {dramaTitle}
      </Link>

      <h1 className="text-lg sm:text-xl font-bold">
        {dramaTitle} - Episode {epNumber}
      </h1>

      {/* Watch Tracker */}
      <WatchTracker item={{
        id: `bilitv/${id}/${epNumber}`,
        source: "BiliTV",
        title: dramaTitle,
        thumbnail: dramaData?.cover || "",
        href: `/drama/bilitv/${id}/watch/${epNumber}`,
        episode: `Episode ${epNumber}`,
      }} />

      {/* Player */}
      <DramaPlayer qualities={qualities} title={`${dramaTitle} - Episode ${epNumber}`} historyId={`bilitv/${id}/${epNumber}`} />

      {/* Download */}
      <DownloadLinks links={downloadLinks} title={`${dramaTitle} Ep ${epNumber}`} />

      {/* Episode Navigation */}
      {dramaData && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Episode Lainnya</h3>
          <div className="flex flex-wrap gap-2">
            {dramaData.episodes
              .filter((ep) => ep.free)
              .map((ep) => (
                <Link
                  key={ep.number}
                  href={`/drama/bilitv/${id}/watch/${ep.number}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    ep.number === epNumber
                      ? "bg-red-500 text-white"
                      : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {ep.number}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentSection videoId={`bilitv/${id}/${epNumber}`} />
    </div>
  );
}
