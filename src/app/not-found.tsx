import Link from "next/link";
import { Film, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-fade-up max-w-md">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[120px] sm:text-[160px] font-black text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-16 h-16 text-red-500/50 animate-float" />
          </div>
        </div>

        {/* Text */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium text-sm transition active:scale-95"
          >
            <Search className="w-4 h-4" />
            Cari Video
          </Link>
        </div>
      </div>
    </div>
  );
}
