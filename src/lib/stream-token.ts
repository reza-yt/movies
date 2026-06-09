import { createClient } from "@supabase/supabase-js";

/**
 * Gets the active StreamAPI token from database.
 * Uses service role to bypass RLS (server-side only).
 * Falls back to env var STREAM_API_TOKEN if DB not configured.
 */
export async function getActiveStreamToken(): Promise<string | null> {
  // First check env var (simplest setup)
  const envToken = process.env.STREAM_API_TOKEN;
  
  // If no Supabase configured, use env token
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return envToken || null;
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get active token from DB (most recently created active one)
    const { data: token } = await supabase
      .from("api_tokens")
      .select("id, token, expires_at")
      .eq("is_active", true)
      .eq("provider", "streamapi")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (token) {
      // Check if expired
      if (token.expires_at && new Date(token.expires_at) < new Date()) {
        // Token expired, deactivate it
        await supabase.from("api_tokens").update({ is_active: false }).eq("id", token.id);
        return envToken || null;
      }

      // Increment request count (fire and forget)
      supabase.from("api_tokens").update({ 
        request_count: 1, // Will be incremented via trigger or manual
        last_used_at: new Date().toISOString() 
      }).eq("id", token.id).then(() => {});

      return token.token;
    }

    // Also check site_settings for global token
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "stream_api_token")
      .single();

    if (setting?.value) {
      return setting.value;
    }

    return envToken || null;
  } catch {
    return envToken || null;
  }
}

/**
 * Determines which API base URL to use based on token availability.
 * If token exists → use streamapi.web.id (premium, all episodes unlocked)
 * If no token → use scripapi.web.id (free, limited episodes)
 */
export async function getApiConfig(): Promise<{
  baseUrl: string;
  headers: Record<string, string>;
  isPremium: boolean;
}> {
  const token = await getActiveStreamToken();

  if (token) {
    return {
      baseUrl: "https://streamapi.web.id/p",
      headers: {
        "api-token": token,
        "Accept": "application/json",
      },
      isPremium: true,
    };
  }

  return {
    baseUrl: "https://scripapi.web.id/gateway.php",
    headers: {
      "Accept": "application/json",
    },
    isPremium: false,
  };
}
