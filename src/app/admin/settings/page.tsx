import { createServerSupabase } from "@/lib/supabase/server";
import { Settings } from "lucide-react";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabase();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .order("key");

  const settingsMap: Record<string, { value: string; description: string; id: string }> = {};
  settings?.forEach((s: any) => {
    settingsMap[s.key] = { value: s.value, description: s.description, id: s.id };
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-400" />
          Site Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Konfigurasi website StreamBro</p>
      </div>

      <SettingsForm settings={settingsMap} />
    </div>
  );
}
