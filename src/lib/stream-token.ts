/**
 * Gets the active StreamAPI token from database.
 * Uses service role to bypass RLS (server-side only).
 * Falls back to env var STREAM_API_TOKEN if DB not configured.
 */
export async function getActiveStreamToken(): Promise<string | null> {
  // First check env var (simplest setup)
  const envToken = process.env.STREAM_API_TOKEN || null;

  // If no Supabase configured or no service key, just use env token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return envToken;
  }

  try {
    // Use direct REST API call with timeout (faster than SDK)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(
      `${supabaseUrl}/rest/v1/api_tokens?is_active=eq.true&provider=eq.streamapi&order=created_at.desc&limit=1&select=id,token,expires_at`,
      {
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
        },
        signal: controller.signal,
        cache: "no-store",
      }
    );

    clearTimeout(timeout);

    if (!res.ok) return envToken;

    const tokens = await res.json();
    if (tokens && tokens.length > 0) {
      const token = tokens[0];

      // Check if expired
      if (token.expires_at && new Date(token.expires_at) < new Date()) {
        return envToken;
      }

      return token.token;
    }

    // Check site_settings for global token
    const settingsRes = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?key=eq.stream_api_token&select=value`,
      {
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
        },
        cache: "no-store",
      }
    );

    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      if (settings?.[0]?.value) {
        return settings[0].value;
      }
    }

    return envToken;
  } catch {
    // Timeout or network error - fallback to env token
    return envToken;
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
