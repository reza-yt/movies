"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Film } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/anime", label: "Anime" },
  { href: "/adult", label: "18+" },
  { href: "/schedule", label: "Jadwal" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Film className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 group-hover:text-red-400 transition-colors" />
              <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm group-hover:bg-red-500/30 transition" />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text">
              StreamBro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? "w-48 sm:w-72" : "w-36 sm:w-56"}`}>
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-3 sm:px-4 py-2 pl-9 sm:pl-10 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300"
              />
              <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}
