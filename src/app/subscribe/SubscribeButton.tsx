"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Crown, Check } from "lucide-react";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
  price: number;
}

export default function SubscribeButton({ planId, planName, price }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleSubscribe() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login?redirect=/subscribe");
      return;
    }

    // Create pending subscription
    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_id: planId,
      status: "pending",
      amount: price,
      payment_method: "transfer",
    });

    if (error) {
      alert(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-green-400">Request Terkirim!</p>
        <p className="text-xs text-gray-400 mt-1">Admin akan mengaktifkan setelah pembayaran dikonfirmasi</p>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm space-y-2">
          <p className="font-medium text-white">Transfer ke:</p>
          <div className="font-mono text-xs text-gray-300 space-y-1">
            <p>🏦 BCA: 1234567890</p>
            <p>🏦 Dana: 081234567890</p>
            <p>🏦 GoPay: 081234567890</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Jumlah: <span className="text-green-400 font-bold">Rp {price.toLocaleString("id-ID")}</span>
          </p>
          <p className="text-xs text-gray-500">
            Setelah transfer, klik &quot;Konfirmasi&quot; di bawah
          </p>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Saya Sudah Transfer
            </>
          )}
        </button>
        <button
          onClick={() => setShowPayment(false)}
          className="w-full px-5 py-2 text-gray-400 text-xs hover:text-white transition"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowPayment(true)}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold rounded-xl text-sm transition-all active:scale-95 hover:shadow-lg hover:shadow-yellow-500/25"
    >
      <Crown className="w-4 h-4" />
      Subscribe {planName}
    </button>
  );
}
