import { getApiConfig } from "@/lib/stream-token";
import { NextResponse } from "next/server";

export async function GET() {
  const config = await getApiConfig();
  return NextResponse.json({
    isPremium: config.isPremium,
    provider: config.isPremium ? "streamapi" : "scripapi",
  });
}
