import { searchAnime, searchAdultVideos, searchBiliTV, searchCashDrama } from "@/lib/api";
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
  } else if (source === "bilitv") {
    const data = await searchBiliTV(query);
    // Normalize BiliTV results to have consistent shape
    const results = (data || []).map((d) => ({
      id: String(d.id),
      title: d.title,
      thumbnail: d.cover,
      slug: String(d.id),
      source: "bilitv",
    }));
    return NextResponse.json({ results });
  } else if (source === "cashdrama") {
    const data = await searchCashDrama(query);
    const results = (data || []).map((d) => ({
      id: d.id,
      title: d.name,
      thumbnail: d.cover,
      slug: d.id,
      episodes: d.episodes,
      source: "cashdrama",
    }));
    return NextResponse.json({ results });
  } else {
    const data = await searchAdultVideos(query, parseInt(page));
    return NextResponse.json({ results: data || [] });
  }
}
