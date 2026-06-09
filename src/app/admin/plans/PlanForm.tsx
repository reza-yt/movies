"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function PlanForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("subscription_plans").insert({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      price: parseInt(price),
      duration_days: parseInt(duration),
      description,
      features: features.split("\n").filter(Boolean),
      is_active: true,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Plan berhasil ditambahkan!");
      setName(""); setSlug(""); setPrice(""); setDuration(""); setDescription(""); setFeatures("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Nama Plan</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Bulanan" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Slug</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="monthly (auto generate)" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Harga (Rp)</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" placeholder="35000" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Durasi (hari)</label>
        <input value={duration} onChange={(e) => setDuration(e.target.value)} required type="number" placeholder="30" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <label className="text-xs text-gray-400">Deskripsi</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Akses premium 30 hari" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <label className="text-xs text-gray-400">Features (1 per baris)</label>
        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={3} placeholder={"Semua episode unlock\nTanpa iklan\nKualitas HD"} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50 resize-none" />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition active:scale-95 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Tambah Plan
        </button>
        {message && <span className={`text-sm ${message.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>{message}</span>}
      </div>
    </form>
  );
}
