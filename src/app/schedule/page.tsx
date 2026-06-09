import { getAnimeSchedule } from "@/lib/api";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

export const metadata = {
  title: "Jadwal Anime - StreamFlix",
};

const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default async function SchedulePage() {
  const schedule = await getAnimeSchedule();

  if (!schedule) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Gagal memuat jadwal anime</p>
      </div>
    );
  }

  // Get today's day name in Indonesian
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-500" />
          Jadwal Anime
        </h1>
        <p className="text-gray-500 mt-1">Jadwal rilis episode anime terbaru</p>
      </div>

      <div className="space-y-8">
        {dayOrder.map((day) => {
          const items = schedule[day];
          if (!items || items.length === 0) return null;

          // Remove duplicates by slug
          const uniqueItems = items.filter(
            (item, index, self) => index === self.findIndex((t) => t.slug === item.slug)
          );

          const isToday = today === day;

          return (
            <div key={day} className="space-y-3">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isToday ? "text-red-400" : "text-white"}`}>
                {day}
                {isToday && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                    Hari ini
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {uniqueItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/anime/${item.slug.replace(/-episode.*$/, "").replace(/-subtitle.*$/, "")}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                  >
                    <div className="flex-shrink-0 w-12 h-16 relative rounded-lg overflow-hidden bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Episode {item.episode}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {item.release_time}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
