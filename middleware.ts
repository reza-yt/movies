import { updateSession } from "@/lib/supabase/middleware";
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
    // Check env var (if explicitly set to "true", always maintenance)
    if (process.env.MAINTENANCE_MODE === "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }

    // Check database for admin panel toggle
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/site_settings?key=eq.maintenance_mode&select=value`,
          {
            headers: {
              "apikey": serviceKey,
              "Authorization": `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            // No cache - always fresh from DB
            cache: "no-store",
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
        // DB error = skip, don't block site
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
