"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Globe, Key, Shield, Eye } from "lucide-react";

interface SettingsFormProps {
  settings: Record<string, { value: string; description: string; id: string }>;
}

const settingGroups = [
  {
    title: "General",
    icon: Globe,
    fields: [
      { key: "site_name", label: "Nama Site", type: "text", help: "", options: [] as string[] },
      { key: "site_description", label: "Deskripsi", type: "text", help: "", options: [] as string[] },
      { key: "maintenance_mode", label: "Mode Maintenance", type: "toggle", help: "", options: [] as string[] },
    ],
  },
  {
    title: "API Configuration",
    icon: Key,
    fields: [
      { key: "stream_api_token", label: "StreamAPI Token (Global)", type: "password", help: "Token ini dipakai server-side untuk semua request. Beli di streamapi.web.id", options: [] as string[] },
      { key: "stream_api_provider", label: "Default Provider", type: "select", help: "", options: ["scripapi", "streamapi"] },
    ],
  },
  {
    title: "Access Control",
    icon: Shield,
    fields: [
      { key: "registration_enabled", label: "Registrasi Dibuka", type: "toggle", help: "", options: [] as string[] },
      { key: "adult_content_enabled", label: "Konten 18+ Aktif", type: "toggle", help: "", options: [] as string[] },
    ],
  },
];

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, v.value]))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const supabase = createClient();
  const router = useRouter();

  function updateValue(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setLoading(true);
    setMessage("");

    const updates = Object.entries(values).map(([key, value]) => ({
      key,
      value,
    }));

    // Upsert each setting
    for (const { key, value } of updates) {
      if (settings[key]) {
        await supabase
          .from("site_settings")
          .update({ value })
          .eq("id", settings[key].id);
      }
    }

    setMessage("Settings berhasil disimpan!");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {settingGroups.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.title} className="p-5 rounded-xl bg-white/5 border border-white/10">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Icon className="w-4 h-4 text-gray-400" />
              {group.title}
            </h2>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="sm:w-48 flex-shrink-0">
                    <label className="text-sm text-gray-300 font-medium">{field.label}</label>
                    {field.help && <p className="text-xs text-gray-600 mt-0.5">{field.help}</p>}
                  </div>
                  <div className="flex-1">
                    {field.type === "toggle" ? (
                      <button
                        type="button"
                        onClick={() => updateValue(field.key, values[field.key] === "true" ? "false" : "true")}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          values[field.key] === "true" ? "bg-green-500" : "bg-gray-700"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            values[field.key] === "true" ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    ) : field.type === "select" ? (
                      <select
                        value={values[field.key] || ""}
                        onChange={(e) => updateValue(field.key, e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50 w-full sm:w-auto"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === "password" ? (
                      <div className="relative">
                        <input
                          type={showPasswords[field.key] ? "text" : "password"}
                          value={values[field.key] || ""}
                          onChange={(e) => updateValue(field.key, e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-red-500/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords((p) => ({ ...p, [field.key]: !p[field.key] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPasswords[field.key] ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={values[field.key] || ""}
                        onChange={(e) => updateValue(field.key, e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500/50"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Menyimpan..." : "Simpan Settings"}
        </button>
        {message && <span className="text-sm text-green-400">{message}</span>}
      </div>
    </div>
  );
}
