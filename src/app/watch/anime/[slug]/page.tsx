import { getAnimeWatch } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { Download, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WatchAnimePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getAnimeWatch(slug);

  if (!data) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-400 text-lg">Video tidak ditemukan</p>
        <Link href="/anime" className="text-red-400 hover:text-red-300">← Kembali ke Anime</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <Link href="/anime" className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Anime
      </Link>

      <h1 className="text-xl md:text-2xl font-bold">{data.title}</h1>

      {/* Player */}
      <VideoPlayer servers={data.streaming_servers} title={data.title} />

      {/* Download Links */}
      {data.download_links && data.download_links.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-green-500" />
            Download
          </h2>
          <div className="space-y-3">
            {data.download_links.map((dl) => (
              <div key={dl.quality} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">{dl.quality}</h3>
                <div className="flex flex-wrap gap-2">
                  {dl.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 hover:bg-green-500/20 transition"
                    >
                      {link.provider}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
