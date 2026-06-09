import { createServerSupabase } from "@/lib/supabase/server";
import { Users, CreditCard, Key, Eye, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  // Fetch stats
  const [
    { count: usersCount },
    { count: activeSubsCount },
    { count: tokensCount },
    { data: recentUsers },
    { data: recentSubs },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("api_tokens").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("id, email, username, role, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("subscriptions").select("id, status, amount, created_at, profiles(email, username)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Users", value: usersCount || 0, icon: Users, color: "blue", href: "/admin/users" },
    { label: "Active Subscriptions", value: activeSubsCount || 0, icon: CreditCard, color: "green", href: "/admin/subscriptions" },
    { label: "API Tokens", value: tokensCount || 0, icon: Key, color: "purple", href: "/admin/tokens" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Overview admin panel StreamBro</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`p-5 rounded-xl border ${colorMap[stat.color]} transition-all hover:scale-[1.02] active:scale-95`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-50" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              User Terbaru
            </h2>
            <Link href="/admin/users" className="text-xs text-red-400 hover:text-red-300">
              Lihat semua →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{user.username || user.email}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.role === "admin" ? "bg-red-500/10 text-red-400" :
                    user.role === "premium" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-gray-500/10 text-gray-400"
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">Belum ada user</p>
            )}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              Subscription Terbaru
            </h2>
            <Link href="/admin/subscriptions" className="text-xs text-red-400 hover:text-red-300">
              Lihat semua →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSubs && recentSubs.length > 0 ? (
              recentSubs.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{(sub.profiles as any)?.username || (sub.profiles as any)?.email || "User"}</p>
                    <p className="text-xs text-gray-500">Rp {sub.amount?.toLocaleString("id-ID")}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    sub.status === "active" ? "bg-green-500/10 text-green-400" :
                    sub.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-gray-500/10 text-gray-400"
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">Belum ada subscription</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
