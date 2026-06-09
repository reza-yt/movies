const BASE_URL = "https://scripapi.web.id/gateway.php";

// ===== 18+ Types =====
export interface AdultVideo {
  title: string;
  slug: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export interface AdultCategory {
  name: string;
  slug: string;
}

export interface AdultVideoDetail {
  title: string;
  slug: string;
  m3u8_url: string;
  duration: string;
  categories: AdultCategory[];
  related_videos: AdultVideo[];
}

// ===== Anime Types =====
export interface AnimeItem {
  slug: string;
  title: string;
  thumbnail?: string;
  image?: string;
  type: string;
  latest_episode?: string;
  status?: string;
  id?: string;
}

export interface AnimeGenre {
  name: string;
  slug: string;
  count: string;
}

export interface AnimeScheduleItem {
  slug: string;
  title: string;
  thumbnail: string;
  episode: string;
  release_time: string;
}

export interface AnimeDetail {
  title: string;
  thumbnail: string;
  synopsis: string;
  info: {
    status: string;
    studio: string;
    durasi: string;
    season: string;
    tipe: string;
    genres: string[];
    [key: string]: unknown;
  };
  episodes: AnimeEpisode[];
}

export interface AnimeEpisode {
  slug: string;
  number: string;
  title: string;
  date: string;
}

export interface AnimeStreamingServer {
  name: string;
  type: string;
  url: string;
}

export interface AnimeDownloadLink {
  quality: string;
  links: { provider: string; url: string }[];
}

export interface AnimeWatchData {
  title: string;
  streaming_servers: AnimeStreamingServer[];
  download_links: AnimeDownloadLink[];
}

// ===== Generic Response =====
export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// ===== Fetch Helper =====
async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      "Accept": "application/json",
    };

    // If STREAM_API_TOKEN is set, use streamapi.web.id for 18+ content
    const token = process.env.STREAM_API_TOKEN;
    let fetchUrl = url.toString();

    if (token && endpoint.startsWith("/18plus")) {
      const streamUrl = new URL(`https://streamapi.web.id/p${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) streamUrl.searchParams.append(key, value);
        });
      }
      fetchUrl = streamUrl.toString();
      headers["api-token"] = token;
    }

    const res = await fetch(fetchUrl, {
      headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (json.status === "success") return json.data;
    return null;
  } catch {
    return null;
  }
}

// ===== 18+ API =====
export async function getAdultVideos(page: number = 1) {
  return fetchApi<AdultVideo[]>("/18plus/api/v1/videos", { page: String(page) });
}

export async function getAdultCategories() {
  return fetchApi<AdultCategory[]>("/18plus/api/v1/categories");
}

export async function getAdultVideosByCategory(slug: string, page: number = 1) {
  return fetchApi<AdultVideo[]>("/18plus/api/v1/category", { slug, page: String(page) });
}

export async function searchAdultVideos(query: string, page: number = 1) {
  return fetchApi<AdultVideo[]>("/18plus/api/v1/search", { q: query, page: String(page) });
}

export async function getAdultVideoDetail(slug: string) {
  return fetchApi<AdultVideoDetail>("/18plus/api/v1/view", { slug });
}

// ===== Anime API =====
export async function getAnimeHome(page: number = 1) {
  return fetchApi<{ page: number; total_pages: number; anime: AnimeItem[] }>("/anime/home", { page: String(page) });
}

export async function getAnimeBatch(page: number = 1) {
  return fetchApi<{ page: number; total_pages: number; anime: AnimeItem[] }>("/anime/batch", { page: String(page) });
}

export async function getAnimeSchedule() {
  return fetchApi<Record<string, AnimeScheduleItem[]>>("/anime/schedule");
}

export async function getAnimeGenres() {
  return fetchApi<AnimeGenre[]>("/anime/genres");
}

export async function searchAnime(query: string, page: number = 1) {
  return fetchApi<{ page: number; total_pages: number; anime: AnimeItem[] }>("/anime/search", { q: query, page: String(page) });
}

export async function getAnimeDetail(slug: string) {
  return fetchApi<AnimeDetail>("/anime/detail", { slug });
}

export async function getAnimeWatch(slug: string) {
  return fetchApi<AnimeWatchData>("/anime/watch", { slug });
}
