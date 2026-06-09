"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Film, User, LogIn, Crown, Shield, LogOut, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/anime", label: "Anime" },
  { href: "/drama", label: "Drama" },
  { href: "/adult", label: "18+" },
  { href: "/schedule", label: "Jadwal" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadUser();
  }, [pathname]);

  async function loadUser() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
    } catch {
      // Supabase not configured
    }
    setLoading(false);
  }

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setShowUserMenu(false);
      router.push("/");
      router.refresh();
    } catch {}
  }

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
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <Film className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 group-hover:text-red-400 transition-colors" />
              <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm group-hover:bg-red-500/30 transition" />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text hidden xs:inline">
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

          {/* Right side: Search + Auth */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? "w-40 sm:w-64" : "w-28 sm:w-48"}`}>
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

            {/* Auth Button */}
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      profile?.role === "admin" ? "bg-red-500/20" :
                      profile?.role === "premium" ? "bg-yellow-500/20" :
                      "bg-gray-500/20"
                    }`}>
                      {profile?.role === "admin" ? (
                        <Shield className="w-3.5 h-3.5 text-red-400" />
                      ) : profile?.role === "premium" ? (
                        <Crown className="w-3.5 h-3.5 text-yellow-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <span className="hidden sm:inline text-gray-300 text-xs font-medium max-w-[80px] truncate">
                      {profile?.username || "User"}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 z-20 w-52 rounded-xl bg-gray-900 border border-white/10 shadow-xl py-2 animate-fade-up">
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <p className="text-sm font-medium text-white">{profile?.username || "User"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            profile?.role === "admin" ? "bg-red-500/10 text-red-400" :
                            profile?.role === "premium" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-gray-500/10 text-gray-400"
                          }`}>
                            {profile?.role || "user"}
                          </span>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                        >
                          <User className="w-4 h-4" /> Akun Saya
                        </Link>

                        {profile?.role !== "premium" && profile?.role !== "admin" && (
                          <Link
                            href="/subscribe"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/5 transition"
                          >
                            <Crown className="w-4 h-4" /> Upgrade Premium
                          </Link>
                        )}

                        {profile?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 transition"
                          >
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}

                        <hr className="border-white/5 my-1" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-red-400 transition"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium transition-all active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
