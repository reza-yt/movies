import { Film, Wrench, Clock } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0f]">
      <div className="text-center space-y-6 animate-fade-up max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Film className="w-10 h-10 text-red-500" />
          <span className="text-2xl font-bold gradient-text">StreamBro</span>
        </div>

        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wrench className="w-12 h-12 text-yellow-400 animate-float" />
          </div>
        </div>

        {/* Text */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Sedang Maintenance
          </h1>
          <p className="text-gray-400 mt-3 leading-relaxed">
            Website sedang dalam perbaikan untuk meningkatkan pengalaman kamu. 
            Kami akan segera kembali!
          </p>
        </div>

        {/* ETA */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
          <Clock className="w-4 h-4 text-yellow-400" />
          Estimasi: beberapa menit
        </div>

        {/* Social */}
        <p className="text-xs text-gray-600">
          Hubungi admin jika butuh bantuan
        </p>
      </div>
    </div>
  );
}
