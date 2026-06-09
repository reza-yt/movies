import { getDramaBoxDetail } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Subtitles } from "lucide-react";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default async function DramaBoxDetailPage({ params }: PageProps) {
  const { bookId } = await params;
  const drama = await getDramaBoxDetail(bookId);

  if (!drama) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <Link href="/drama/dramabox" className="text-red-400 hover:text-red-300 text-sm">
        ← Kembali ke DramaBox
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-shrink-0 w-40 mx-auto sm:mx-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={drama.cover}
              alt={drama.bookName}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-xl sm:text-2xl font-bold">{drama.bookName}</h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
              DramaBox
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
              {drama.totalEpisodes} Episode
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              {drama.quality}p HD
            </span>
            {drama.episodes[0]?.subtitles && drama.episodes[0].subtitles.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                <Subtitles className="w-3 h-3" /> Subtitle
              </span>
            )}
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
          Daftar Episode ({drama.episodes.length})
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
          {drama.episodes.map((ep) => (
            <Link
              key={ep.chapterId}
              href={`/drama/dramabox/${bookId}/watch/${ep.episode}`}
              className="flex items-center justify-center gap-1 p-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-gray-200 hover:text-white"
            >
              <Play className="w-3 h-3 text-red-400" />
              {ep.episode}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
