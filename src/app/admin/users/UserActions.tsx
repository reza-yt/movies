"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MoreVertical, Shield, Crown, User, Ban } from "lucide-react";

interface UserActionsProps {
  userId: string;
  currentRole: string;
}

export default function UserActions({ userId, currentRole }: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function changeRole(newRole: string) {
    setLoading(true);
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  async function toggleActive() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("is_active").eq("id", userId).single();
    await supabase.from("profiles").update({ is_active: !data?.is_active }).eq("id", userId);
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-48 rounded-xl bg-gray-900 border border-white/10 shadow-xl py-1 animate-fade-up">
            {currentRole !== "admin" && (
              <button
                onClick={() => changeRole("admin")}
                disabled={loading}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
              >
                <Shield className="w-3.5 h-3.5 text-red-400" /> Set Admin
              </button>
            )}
            {currentRole !== "premium" && (
              <button
                onClick={() => changeRole("premium")}
                disabled={loading}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
              >
                <Crown className="w-3.5 h-3.5 text-yellow-400" /> Set Premium
              </button>
            )}
            {currentRole !== "user" && (
              <button
                onClick={() => changeRole("user")}
                disabled={loading}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
              >
                <User className="w-3.5 h-3.5 text-gray-400" /> Set User
              </button>
            )}
            <hr className="border-white/5 my-1" />
            <button
              onClick={toggleActive}
              disabled={loading}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 transition"
            >
              <Ban className="w-3.5 h-3.5" /> Ban / Unban
            </button>
          </div>
        </>
      )}
    </div>
  );
}
