import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check maintenance mode (skip for admin, auth, and API routes)
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/auth") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    const maintenanceMode = process.env.MAINTENANCE_MODE;

    if (maintenanceMode === "true") {
      // Allow maintenance page itself
      if (pathname === "/maintenance") {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
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
