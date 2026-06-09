"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Power, Trash2, Copy, Check } from "lucide-react";

interface TokenActionsProps {
  tokenId: string;
  isActive: boolean;
}

export default function TokenActions({ tokenId, isActive }: TokenActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function toggleActive() {
    setLoading(true);
    await supabase.from("api_tokens").update({ is_active: !isActive }).eq("id", tokenId);
    setLoading(false);
    router.refresh();
  }

  async function deleteToken() {
    setLoading(true);
    await supabase.from("api_tokens").delete().eq("id", tokenId);
    setLoading(false);
    setShowConfirm(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleActive}
        disabled={loading}
        className={`p-2 rounded-lg text-xs font-medium transition ${
          isActive
            ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
        }`}
        title={isActive ? "Nonaktifkan" : "Aktifkan"}
      >
        <Power className="w-4 h-4" />
      </button>

      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={deleteToken}
            disabled={loading}
            className="px-2 py-1 rounded bg-red-500 text-white text-xs font-medium"
          >
            Hapus
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs"
          >
            Batal
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          title="Hapus token"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
