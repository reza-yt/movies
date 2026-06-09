import { searchAnime, searchAdultVideos } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "anime";
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (source === "anime") {
    const data = await searchAnime(query, parseInt(page));
    return NextResponse.json({ results: data?.anime || [] });
  } else {
    const data = await searchAdultVideos(query, parseInt(page));
    return NextResponse.json({ results: data || [] });
  }
}
