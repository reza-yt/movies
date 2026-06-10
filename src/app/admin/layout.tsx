import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Panel - StreamBro",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch {
    redirect("/auth/login?redirect=/admin");
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login?redirect=/admin");
  }

  // Fetch profile - use service role if available to bypass RLS
  let profile = null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (serviceKey && supabaseUrl) {
    // Use service role to bypass RLS
    const { createClient } = await import("@supabase/supabase-js");
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  } else {
    // Fallback: try with anon key
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <AdminSidebar user={profile} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
