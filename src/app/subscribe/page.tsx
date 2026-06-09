import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { Crown, Check, Zap } from "lucide-react";
import SubscribeButton from "./SubscribeButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscribe Premium - StreamBro",
};

export default async function SubscribePage() {
  const supabase = await createServerSupabase();
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-up">
      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          Premium Access
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          Upgrade ke <span className="gradient-text">Premium</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm sm:text-base">
          Unlock semua episode drama, tanpa batasan, kualitas HD
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans?.map((plan: any, index: number) => {
          const isPopular = index === 1;
          return (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                isPopular
                  ? "bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border-yellow-500/30 shadow-xl shadow-yellow-500/5"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">
                  POPULER
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">
                    Rp {plan.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    / {plan.duration_days} hari
                  </span>
                </div>
                {plan.description && (
                  <p className="text-xs text-gray-500 mt-2">{plan.description}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {plan.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Subscribe Button */}
              {user ? (
                <SubscribeButton planId={plan.id} planName={plan.name} price={plan.price} />
              ) : (
                <Link
                  href="/auth/login?redirect=/subscribe"
                  className="block w-full text-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition"
                >
                  Login untuk Subscribe
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Pembayaran via transfer bank / e-wallet</p>
        <p>Setelah pembayaran, admin akan mengaktifkan akun kamu dalam 1x24 jam</p>
      </div>
    </div>
  );
}
