import { getVideosByCategory } from "@/lib/api";
import VideoGrid from "@/components/VideoGrid";
import { getSourceById } from "@/lib/sources";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string; categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug, categorySlug } = await params;
  const { page } = await searchParams;
  const source = getSourceById(slug);

  if (!source) {
    notFound();
  }

  const currentPage = parseInt(page || "1");
  const data = await getVideosByCategory(source.id, categorySlug, currentPage);
  const videos = Array.isArray(data?.data) ? data.data : [];

  return (
    <div>
      <div className="mb-6">
        <Link href={`/source/${slug}`} className="text-red-400 hover:text-red-300 text-sm">
          ← Back to {source.name}
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          {categorySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <p className="text-gray-400 mt-1">From {source.name}</p>
      </div>

      <VideoGrid videos={videos} source={source.id} />

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        {currentPage > 1 && (
          <Link
            href={`/source/${slug}/category/${categorySlug}?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            ← Previous
          </Link>
        )}
        <span className="px-4 py-2 text-gray-400 text-sm">Page {currentPage}</span>
        {videos.length >= 10 && (
          <Link
            href={`/source/${slug}/category/${categorySlug}?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
