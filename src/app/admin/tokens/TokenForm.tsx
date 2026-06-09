"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Eye, EyeOff } from "lucide-react";

export default function TokenForm() {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [provider, setProvider] = useState("streamapi");
  const [expiresAt, setExpiresAt] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("api_tokens").insert({
      name,
      token,
      provider,
      is_active: true,
      expires_at: expiresAt || null,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Token berhasil ditambahkan!");
      setName("");
      setToken("");
      setExpiresAt("");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleTestToken() {
    if (!token) return;
    setLoading(true);
    setMessage("Testing token...");

    try {
      const res = await fetch(`https://streamapi.web.id/p/bilitv/api/v1/drama/1875/episode/15`, {
        headers: { "api-token": token },
      });
      const data = await res.json();

      if (data && data.video) {
        setMessage("✅ Token valid! Episode premium berhasil di-unlock.");
      } else if (data.error) {
        setMessage(`❌ Token error: ${data.error}`);
      } else {
        setMessage("⚠️ Token aktif tapi response tidak sesuai. Cek manual.");
      }
    } catch {
      setMessage("❌ Gagal test token. Cek koneksi atau token.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Nama Token</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="StreamAPI - Bulan Juni"
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50"
          >
            <option value="streamapi">StreamAPI (streamapi.web.id)</option>
            <option value="scripapi">ScripAPI (scripapi.web.id)</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs text-gray-400">API Token</label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Paste token dari dashboard streamapi.web.id"
              className="w-full px-3 py-2.5 pr-20 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-red-500/50"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-300"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Expired Date (opsional)</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition active:scale-95 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Simpan Token
        </button>
        <button
          type="button"
          onClick={handleTestToken}
          disabled={loading || !token}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-lg text-sm font-medium transition active:scale-95 disabled:opacity-50"
        >
          🧪 Test Token
        </button>
        {message && (
          <span className={`text-sm ${message.startsWith("Error") || message.startsWith("❌") ? "text-red-400" : message.startsWith("✅") ? "text-green-400" : "text-yellow-400"}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
