const BASE_URL = "https://scripapi.web.id/gateway.php";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  slug?: string;
  duration?: string;
  views?: string;
  rating?: string;
  year?: string;
  quality?: string;
  episodes?: number;
  status?: string;
  type?: string;
  [key: string]: unknown;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  [key: string]: unknown;
}

export interface VideoDetail {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  slug?: string;
  duration?: string;
  views?: string;
  rating?: string;
  year?: string;
  quality?: string;
  episodes?: Episode[];
  streaming_links?: StreamingLink[];
  [key: string]: unknown;
}

export interface Episode {
  id: string;
  title: string;
  episode_number?: number;
  streaming_links?: StreamingLink[];
  [key: string]: unknown;
}

export interface StreamingLink {
  url: string;
  quality?: string;
  server?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status?: boolean;
  message?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  [key: string]: unknown;
}

async function fetchApi<T>(source: string, endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${BASE_URL}/${source}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

export async function getLatestVideos(source: string, page: number = 1) {
  return fetchApi<ApiResponse<Video[]>>(source, "/api/v1/videos", { page: String(page) });
}

export async function getCategories(source: string) {
  return fetchApi<ApiResponse<Category[]>>(source, "/api/v1/categories");
}

export async function getVideosByCategory(source: string, categorySlug: string, page: number = 1) {
  return fetchApi<ApiResponse<Video[]>>(source, `/api/v1/categories/${categorySlug}`, { page: String(page) });
}

export async function searchVideos(source: string, query: string, page: number = 1) {
  return fetchApi<ApiResponse<Video[]>>(source, "/api/v1/search", { q: query, page: String(page) });
}

export async function getVideoDetail(source: string, slug: string) {
  return fetchApi<ApiResponse<VideoDetail>>(source, `/api/v1/videos/${slug}`);
}
