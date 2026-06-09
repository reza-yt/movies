"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, Search, Calendar, Film } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/anime", label: "Anime", icon: Film },
  { href: "/search", label: "Search", icon: Search },
  { href: "/adult", label: "18+", icon: Flame },
  { href: "/schedule", label: "Jadwal", icon: Calendar },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-red-400 bg-red-500/10"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
