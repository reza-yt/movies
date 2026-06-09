"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

interface SubActionsProps {
  subId: string;
  currentStatus: string;
  userId: string;
}

export default function SubActions({ subId, currentStatus, userId }: SubActionsProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function approve() {
    setLoading(true);
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    await supabase.from("subscriptions").update({
      status: "active",
      starts_at: now.toISOString(),
      expires_at: expires.toISOString(),
    }).eq("id", subId);

    // Update user role to premium
    await supabase.from("profiles").update({
      role: "premium",
      subscription_expires_at: expires.toISOString(),
    }).eq("id", userId);

    setLoading(false);
    router.refresh();
  }

  async function cancel() {
    setLoading(true);
    await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", subId);
    await supabase.from("profiles").update({ role: "user", subscription_expires_at: null }).eq("id", userId);
    setLoading(false);
    router.refresh();
  }

  if (currentStatus === "pending") {
    return (
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={approve}
          disabled={loading}
          className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
          title="Approve"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
        <button
          onClick={cancel}
          disabled={loading}
          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          title="Reject"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (currentStatus === "active") {
    return (
      <button
        onClick={cancel}
        disabled={loading}
        className="text-xs text-red-400 hover:text-red-300 transition"
      >
        Cancel
      </button>
    );
  }

  return <span className="text-xs text-gray-600">—</span>;
}
