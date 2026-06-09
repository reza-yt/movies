import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Crown, CreditCard, Clock, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Akun Saya - StreamBro",
};

export default async function AccountPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: activeSub } = await supabase
    .from("subscriptions")
    .select("*, subscription_plans(name, duration_days)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const isPremium = profile?.role === "premium" || profile?.role === "admin";
  const expiresAt = activeSub?.expires_at ? new Date(activeSub.expires_at) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
      <h1 className="text-2xl font-bold">Akun Saya</h1>

      {/* Profile Card */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <User className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{profile?.username || "User"}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              profile?.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" :
              profile?.role === "premium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
              "bg-gray-500/10 text-gray-400 border-gray-500/20"
            }`}>
              {profile?.role === "admin" ? <Shield className="w-3 h-3" /> :
               profile?.role === "premium" ? <Crown className="w-3 h-3" /> :
               <User className="w-3 h-3" />}
              {profile?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="p-6 rounded-xl border border-white/10 bg-white/5">
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-green-400" />
          Status Langganan
        </h3>

        {isPremium && activeSub && !isExpired ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-medium">Aktif - Premium</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Plan</p>
                <p className="font-medium">{(activeSub.subscription_plans as any)?.name || "Premium"}</p>
              </div>
              <div>
                <p className="text-gray-500">Berakhir</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {expiresAt?.toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ✅ Semua episode drama unlock • Kualitas HD • Tanpa batasan
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-gray-400 font-medium">
                {isExpired ? "Expired" : "Belum berlangganan"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Upgrade ke premium untuk unlock semua episode di BiliTV, CashDrama, dan lainnya.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-yellow-500/25 transition active:scale-95"
            >
              <Crown className="w-4 h-4" />
              Upgrade ke Premium
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/subscribe"
          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition text-center"
        >
          <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm font-medium">Paket Premium</p>
        </Link>
        <Link
          href="/"
          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition text-center"
        >
          <CreditCard className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-medium">Nonton Sekarang</p>
        </Link>
      </div>
    </div>
  );
}
