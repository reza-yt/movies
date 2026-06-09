import { getApiConfig } from "./stream-token";

const FREE_BASE_URL = "https://scripapi.web.id/gateway.php";

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

// ===== Fetch Helper (auto-uses premium token if available) =====
async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const config = await getApiConfig();

    // Build URL based on whether we have premium access
    const url = new URL(`${config.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), {
      headers: config.headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      // Fallback to free API if premium fails
      if (config.isPremium) {
        const fallbackUrl = new URL(`${FREE_BASE_URL}${endpoint}`);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value) fallbackUrl.searchParams.append(key, value);
          });
        }
        const fallbackRes = await fetch(fallbackUrl.toString(), {
          headers: { "Accept": "application/json" },
          next: { revalidate: 300 },
        });
        if (!fallbackRes.ok) return null;
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson.status === "success") return fallbackJson.data;
        return null;
      }
      return null;
    }

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


// ===== Drama Types (BiliTV & CashDrama) =====

export interface BiliTVDrama {
  id: number;
  title: string;
  cover: string;
  episodes: number;
  description?: string;
}

export interface BiliTVDramaDetail {
  id: number;
  title: string;
  cover: string;
  description: string;
  episodes: { id: number; number: number; free: boolean }[];
}

export interface BiliTVEpisodeData {
  id: number;
  number: number;
  title: string;
  video: string;
  qualities: Record<string, string>;
  isLocked: boolean;
}

export interface CashDrama {
  id: string;
  name: string;
  cover: string;
  coverHor?: string;
  description?: string;
  episodes: number;
  isDubbing?: boolean;
  tags?: string[];
}

export interface CashDramaDetail {
  info: {
    vid: string;
    name: string;
    cover: string;
    coverHor: string;
    dramaCount: string;
    freeCount: string;
    isDubbing: string;
    language?: string;
  };
  episodes: { ep: string; vid: string; fileId: string }[];
}

export interface CashDramaPlayData {
  vid: string;
  ep: number;
  name: string;
  duration: number;
  cover: string;
  drmToken: string;
  streams: unknown[];
  adaptive: { type: string; url: string; width: number; height: number }[];
}

export interface CashDramaTag {
  tagTypeId: string;
  language: string;
  tagId: string;
  tagName: string;
}

// ===== Drama Fetch Helper (auto-uses premium token) =====
async function fetchDramaApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const config = await getApiConfig();
    const url = new URL(`${config.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), {
      headers: config.headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      // Fallback to free API
      if (config.isPremium) {
        const fallbackUrl = new URL(`${FREE_BASE_URL}${endpoint}`);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value) fallbackUrl.searchParams.append(key, value);
          });
        }
        const fRes = await fetch(fallbackUrl.toString(), { headers: { "Accept": "application/json" }, next: { revalidate: 300 } });
        if (!fRes.ok) return null;
        const json = await fRes.json();
        if (json.success === true && json.data) return json.data as T;
        if (Array.isArray(json)) return json as unknown as T;
        if (json && !json.error && !json.status && json.id !== undefined) return json as T;
        if (json.dramas || json.total !== undefined) return json as T;
        return null;
      }
      return null;
    }

    const json = await res.json();
    // CashDrama wraps in {success, data}
    if (json.success === true && json.data) return json.data as T;
    // BiliTV returns raw array or object with dramas
    if (Array.isArray(json)) return json as unknown as T;
    if (json && !json.error && !json.status && json.id !== undefined) return json as T;
    if (json.dramas || json.total !== undefined) return json as T;

    return null;
  } catch {
    return null;
  }
}

// ===== BiliTV API =====
export async function getBiliTVDramas(page: number = 1) {
  return fetchDramaApi<{ total: number; page: number; dramas: BiliTVDrama[] }>("/bilitv/api/v1/home", { page: String(page) });
}

export async function getBiliTVDramaDetail(id: number) {
  return fetchDramaApi<BiliTVDramaDetail>(`/bilitv/api/v1/drama/${id}`);
}

export async function getBiliTVEpisode(dramaId: number, episode: number) {
  return fetchDramaApi<BiliTVEpisodeData>(`/bilitv/api/v1/drama/${dramaId}/episode/${episode}`);
}

export async function searchBiliTV(query: string) {
  return fetchDramaApi<BiliTVDrama[]>("/bilitv/api/v1/search", { q: query });
}

// ===== CashDrama API =====
export async function getCashDramaHome() {
  const data = await fetchDramaApi<{ list: CashDrama[] }>("/cashdrama/api/v1/home");
  return data?.list || null;
}

export async function getCashDramaTags() {
  const data = await fetchDramaApi<{ list: CashDramaTag[] }>("/cashdrama/api/v1/tags");
  return data?.list || null;
}

export async function getCashDramaDetail(vid: string) {
  return fetchDramaApi<CashDramaDetail>(`/cashdrama/api/v1/drama/${vid}`);
}

export async function getCashDramaPlay(vid: string, ep: number) {
  return fetchDramaApi<CashDramaPlayData>(`/cashdrama/api/v1/play/${vid}/${ep}`);
}

export async function searchCashDrama(query: string) {
  const data = await fetchDramaApi<{ list: CashDrama[] }>("/cashdrama/api/v1/search", { q: query });
  return data?.list || null;
}



// ===== DramaBox V4 Types =====
export interface DramaBoxBook {
  bookId: string;
  bookName: string;
  coverWap?: string;
  cover?: string;
  chapterCount?: number;
  totalEpisodes?: number;
  introduction?: string;
  tags?: string[];
}

export interface DramaBoxEpisode {
  episode: number;
  chapterId: string;
  chapterName: string;
  cover: string;
  quality: number;
  url: string;
  subtitles?: { lang: string; url: string; isDefault: boolean; format: string }[];
}

export interface DramaBoxDetail {
  bookId: string;
  bookName: string;
  cover: string;
  description: string;
  totalEpisodes: number;
  quality: number;
  episodes: DramaBoxEpisode[];
}

export interface DramaBoxSection {
  id: number;
  title: string;
  books: DramaBoxBook[];
}

// ===== DramaBox V4 Fetch Helper (auto-uses premium token) =====
async function fetchDramaBoxApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const config = await getApiConfig();
    const url = new URL(`${config.baseUrl}/dramaboxv4/api${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), {
      headers: config.headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      // Fallback to free
      if (config.isPremium) {
        const fallbackUrl = new URL(`${FREE_BASE_URL}/dramaboxv4/api${endpoint}`);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value) fallbackUrl.searchParams.append(key, value);
          });
        }
        const fRes = await fetch(fallbackUrl.toString(), { headers: { "Accept": "application/json" }, next: { revalidate: 300 } });
        if (!fRes.ok) return null;
        const json = await fRes.json();
        if (json.code === 0 && json.data) return json.data as T;
        return null;
      }
      return null;
    }

    const json = await res.json();
    if (json.code === 0 && json.data) return json.data as T;
    return null;
  } catch {
    return null;
  }
}

// ===== DramaBox V4 API =====
export async function getDramaBoxHome() {
  const data = await fetchDramaBoxApi<{ data: { sections: DramaBoxSection[] } }>("/home");
  return data?.data?.sections || null;
}

export async function getDramaBoxDetail(bookId: string) {
  return fetchDramaBoxApi<DramaBoxDetail>(`/drama/${bookId}/episodes`);
}

export async function searchDramaBox(keyword: string) {
  const data = await fetchDramaBoxApi<{ data: { searchList: unknown[] } }>("/search", { keyword });
  if (!data?.data?.searchList) return null;
  // Filter only book results (not actors)
  return data.data.searchList.filter((item: any) => item.bookId) as DramaBoxBook[];
}

export async function getDramaBoxRank() {
  return fetchDramaBoxApi<{ data: { books: DramaBoxBook[] } }>("/rank");
}
