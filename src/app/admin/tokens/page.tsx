import { createServerSupabase } from "@/lib/supabase/server";
import { Key, CheckCircle, XCircle, Zap, Clock } from "lucide-react";
import TokenForm from "./TokenForm";
import TokenActions from "./TokenActions";

export default async function AdminTokensPage() {
  const supabase = await createServerSupabase();
  const { data: tokens } = await supabase
    .from("api_tokens")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Key className="w-6 h-6 text-purple-400" />
          API Token Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola token StreamAPI untuk unlock semua episode premium
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
        <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4" />
          Cara Kerja Token
        </h3>
        <ul className="text-xs text-gray-400 space-y-1.5">
          <li>• Token dari <span className="text-purple-300">streamapi.web.id</span> digunakan untuk unlock semua episode di BiliTV, CashDrama, dll</li>
          <li>• Masukkan token di sini, sistem otomatis pakai token yang aktif untuk request ke API</li>
          <li>• Jika token expired/habis, sistem fallback ke scripapi.web.id (gratis, tapi episode terbatas)</li>
          <li>• Bisa tambah beberapa token sebagai backup (round-robin)</li>
        </ul>
      </div>

      {/* Tokens List */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg">Token Aktif</h2>
        {tokens && tokens.length > 0 ? (
          <div className="space-y-3">
            {tokens.map((token: any) => (
              <div
                key={token.id}
                className={`p-4 rounded-xl border transition ${
                  token.is_active
                    ? "bg-white/5 border-white/10"
                    : "bg-red-500/5 border-red-500/20 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {token.is_active ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                      <h3 className="font-medium text-sm truncate">{token.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {token.provider}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">
                        {token.token.substring(0, 8)}...{token.token.substring(token.token.length - 4)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {token.request_count} requests
                      </span>
                      {token.last_used_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last: {new Date(token.last_used_at).toLocaleDateString("id-ID")}
                        </span>
                      )}
                      {token.expires_at && (
                        <span className={`flex items-center gap-1 ${new Date(token.expires_at) < new Date() ? "text-red-400" : "text-green-400"}`}>
                          Exp: {new Date(token.expires_at).toLocaleDateString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                  <TokenActions tokenId={token.id} isActive={token.is_active} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
            <Key className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada token</p>
            <p className="text-gray-600 text-xs mt-1">Tambah token dari streamapi.web.id di bawah</p>
          </div>
        )}
      </div>

      {/* Add Token Form */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h2 className="font-bold mb-4">Tambah Token Baru</h2>
        <TokenForm />
      </div>
    </div>
  );
}
