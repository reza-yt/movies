const ANIME_BASE_URL = "https://scripapi.web.id/gateway.php";
const ADULT_BASE_URL = "https://streamapi.web.id/p";

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

// ===== Fetch Helpers =====

// Anime fetch (no auth needed, uses scripapi.web.id)
async function fetchAnimeApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${ANIME_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), {
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

// Adult fetch (requires token, uses streamapi.web.id)
async function fetchAdultApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const token = process.env.STREAM_API_TOKEN;
    if (!token) {
      console.error("[StreamFlix] STREAM_API_TOKEN not set");
      return null;
    }

    const url = new URL(`${ADULT_BASE_URL}/18plus${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), {
      headers: {
        "api-token": token,
        "Accept": "application/json",
      },
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
  return fetchAdultApi<AdultVideo[]>("/api/v1/videos", { page: String(page) });
}

export async function getAdultCategories() {
  return fetchAdultApi<AdultCategory[]>("/api/v1/categories");
}

export async function getAdultVideosByCategory(slug: string, page: number = 1) {
  return fetchAdultApi<AdultVideo[]>("/api/v1/category", { slug, page: String(page) });
}

export async function searchAdultVideos(query: string, page: number = 1) {
  return fetchAdultApi<AdultVideo[]>("/api/v1/search", { q: query, page: String(page) });
}

export async function getAdultVideoDetail(slug: string) {
  return fetchAdultApi<AdultVideoDetail>("/api/v1/view", { slug });
}

// ===== Anime API =====
export async function getAnimeHome(page: number = 1) {
  return fetchAnimeApi<{ page: number; total_pages: number; anime: AnimeItem[] }>("/anime/home", { page: String(page) });
}

export async function getAnimeBatch(page: number = 1) {
  return fetchAnimeApi<{ page: number; total_pages: number; anime: AnimeItem[] }>("/anime/batch", { page: String(page) });
}

export async function getAnimeSchedule() {
  return fetchAnimeApi<Record<string, AnimeScheduleItem[]>>("/anime/schedule");
}

export async function getAnimeGenres() {
  return fetchAnimeApi<AnimeGenre[]>("/anime/genres");
}

export async function searchAnime(query: string, page: number = 1) {
  return fetchAnimeApi<{ page: number; total_pages: number; anime: AnimeItem[] }>("/anime/search", { q: query, page: String(page) });
}

export async function getAnimeDetail(slug: string) {
  return fetchAnimeApi<AnimeDetail>("/anime/detail", { slug });
}

export async function getAnimeWatch(slug: string) {
  return fetchAnimeApi<AnimeWatchData>("/anime/watch", { slug });
}
