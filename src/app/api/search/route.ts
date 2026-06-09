import { searchVideos } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "movie";
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  const data = await searchVideos(source, query, parseInt(page));
  return NextResponse.json(data || { data: [] });
}
