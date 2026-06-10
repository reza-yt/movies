import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip maintenance check for admin, auth, API, and static routes
  const skipMaintenance =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/maintenance";

  if (!skipMaintenance) {
    // 1. Check env var first (fastest)
    if (process.env.MAINTENANCE_MODE === "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }

    // 2. Check database (site_settings table) for admin panel toggle
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      try {
        // Direct fetch to Supabase REST API (works in Edge Runtime)
        const res = await fetch(
          `${supabaseUrl}/rest/v1/site_settings?key=eq.maintenance_mode&select=value`,
          {
            headers: {
              "apikey": serviceKey,
              "Authorization": `Bearer ${serviceKey}`,
            },
            next: { revalidate: 10 }, // Cache for 10 seconds
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data?.[0]?.value === "true") {
            const url = request.nextUrl.clone();
            url.pathname = "/maintenance";
            return NextResponse.rewrite(url);
          }
        }
      } catch {
        // Ignore errors, continue normally
      }
    }
  }

  // Handle auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|placeholder.jpg|.*\\.svg).*)",
  ],
};
